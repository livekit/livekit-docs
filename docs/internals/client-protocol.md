---
title: Client Protocol
---

This is an overview of the core protocol LiveKit uses to communicate with clients. It's primarily oriented towards those building new client SDKs or developers interested in contributing to LiveKit.

:::note

Using LiveKit in your app does not require you to understand the underlying protocol. This is one of our design goals.

:::

## Basics

LiveKit clients use a WebSocket to communicate with the server over Protocol Buffers. Clients additionally open two WebRTC PeerConnections, used for publishing and receiving streams, respectively.

![Client-Server Connection](/img/client-server-connection.png)

### Protobufs

LiveKit uses Protocol Buffers for all of its communications. Communication happens asynchronously: one side may send a message to the other at any time, without the expectation of an immediate response. LiveKit protobufs reside in the [livekit/protocol repo](https://github.com/livekit/protocol).

As a convention, a client always sends a `SignalRequest` and the server replies with a `SignalResponse`.

### Dedicated PeerConnections

For each client connected to the server, we use up to two separate `PeerConnection` objects. One for publishing tracks to the server, and the other for receiving subscribed tracks.

Using separate peer connections simplifies the negotiation process and eliminates negotiation [Glares](https://www.ietf.org/proceedings/82/slides/rtcweb-10.pdf). The side sending tracks to the other will be the one that initiates the offer.

## Joining a room

1. client initiates WebSocket connection to `/rtc`
2. server sends a `JoinResponse`, which includes room information, the current participant's data, and information about other participants in the room
3. client starts the publisher `PeerConnection`, and sends `offer` to the server
4. client and server will exchange ICE candidates via `trickle`
5. server accepts the publisher connection, sends an `answer`
6. ICE connectivity is established
7. server notifies other participants of the new participant
8. server subscribes the new client to existing tracks in the room
   1. server initiates `offer` for subscriber `PeerConnection`
   2. client accepts and sends `answer`
   3. server confirms the `answer`

## Publishing

To publish a track, a client must first notify the server of its intent and send up any client-defined metadata about the track.

1. client sends a `AddTrackRequest` with track metadata
2. server sends back a `TrackPublishedResponse`
3. client adds `transceiver` to `PeerConnection`, along with the media track
4. server receives the track and subscribes other participants to it

## Receiving tracks

LiveKit server sends down track metadata to all participants in a room as soon as it's published, then it adds the track to each client's subscriber `PeerConnection`.

Since these messages are sent over two, separate communication channels, it's possible for the client to receive a `PeerConnection.onTrack` callback before track metadata is received. If this happens, the client waits to process the track until metadata is received.

## Server events

The client must also be ready to act upon other changes in the room. The server will notify clients of:

- `ParticipantUpdate`: when participants join or leave, or if there are changes to their tracks
- `ActiveSpeakerUpdate`: when the active speakers in the room change
- `LeaveRequest`: when the participant should immediately disconnect 

## Client-initiated control

### Mute/unmute local tracks

WebRTC doesn't natively support muting tracks. When a track is disabled, it will continue to periodically send "empty" packets. With LiveKit (and SFUs, in general), we want a discrete mute event in order to notify other participants of the change and to optimize network consumption by suppressing empty packets.

To mute a track, set `MediaStreamTrack.enabled` to false, and subsequently send a `MuteTrackRequest` to the server with that track's `sid`.

### Changing quality of streams

For a particular client, `UpdateTrackSettings` informs the server whether a subscribed track should be temporarily paused, or if the server should send down a stream of differing quality. This is especially useful for larger rooms, when the client wants to optimize how much data it's receiving at once. For example, offscreen clients could have their streams temporarily paused.

### Subscription control

Clients also have the ability to control which tracks they're subscribed to. An `UpdateSubscription` message allows the client to subscribe or unsubscribe to published tracks.
