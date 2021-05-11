---
title: Client Protocol
---

This section serves as an overview for the core protocol LiveKit uses to communicate with clients. This page is primarily geared towards client implementers or devs looking to contribute to LiveKit.

Using LiveKit in your app does not require you to understand the underlying protocol.

## Basics

LiveKit clients use a WebSocket connection for communicating with the server over Protocol Buffers. In addition, it also creates two WebRTC PeerConnections, used for publishing and receiving streams.

![Client-Server Connection](/img/client-server-connection.png)

### Protobufs

LiveKit uses Protocol Buffers for all of its communications. The communication happens asynchrously: each side may send a message to the other at any time, without the expectation of an immediate response. LiveKit protobufs reside in [livekit/protocol repo](https://github.com/livekit/protocol).

As a convention, the client always sends a `SignalRequest` to the server, and server would send back a `SignalResponse`.

### Dedicated PeerConnections

We use up to two separate PeerConnections for each client that's connected to the server. One for publishing tracks to the server, and the other for receiving other subscribed tracks.

Using separate PeerConnections simplifies the negotiation process, and eliminates negotiation glares. The side that is sending tracks to the other will be the side that initiates the offer.

## Joining a room

1. client initiates WebSocket connection to `/rtc`
2. server sends a `JoinResponse`, which includes room information, the current participant's data, and information about other participants in the room.
3. client starts the publisher PeerConnection, and sends `offer` to server
4. client and server will exchange ICE candidates via `trickle`
5. server accepts the publisher connection, sends an `answer`
6. ICE connectivity is established
7. server notifies other participants of the new participant
8. server subscribes new client to existing tracks in the room
   1. server initiates `offer` for subscriber PeerConnection
   2. client accepts and sends `answer`
   3. server confirms the answer

## Publishing

In order to publish a track, the client must first notify the server of its intent, and send up any client-defined metadata about the track.

1. client sends a `AddTrackRequest` with track metadata
2. server sends back a `TrackPublishedResponse`
3. client adds `transceiver` to PeerConnection, along with the media track
4. server receives the track and subscribes other participants to it

## Receiving tracks

LiveKit sends down track metadata to all participants in the room as soon as it's published, then it adds the track to the subscriber PeerConnection to the client.

Because these are taking place on two separate communication channels, it's possible for the client to receive a `PeerConnection.onTrack` callback before metadata is received. If that happens, the client should wait to process onTrack after metadata is received.

## Server events

The client should also be ready to act on other changes in the room. Server will notify clients of

- `ParticipantUpdate`: when participants join and leave, or if there are changes to their tracks
- `ActiveSpeakerUpdate`: when the active speakers in the room changed
- `LeaveRequest`: when the participant should disconnect immediately

## Client-initiated control

### Mute/unmute local tracks

WebRTC doesn't support mute natively. When a track is disabled, it'll continue to send "empty" packets periodically. With an SFU like LiveKit, we'd want a more specific mute event in order to notify other participants of the change, and to optimize network consumption by cutting out the empty packets.

To mute a track, set `MediaStreamTrack.enabled` to false, and then send a `MuteTrackRequest` to the server with that track sid.

### Changing quality of stream

`UpdateTrackSettings` tells the server if a particular subscribed track should be paused temporarily for the current client, or if the server should be sending down a different quality stream. This is useful in larger rooms, when the client wants to optimize for how much data it's receiving at the same time. For clients that appear off screen, their stream could be paused temporarily.

### Subscription control

Clients also have the ability to control which tracks they are subscribed to. A `UpdateSubscription` message allows the client to subscribe or unsubscribe to published tracks.
