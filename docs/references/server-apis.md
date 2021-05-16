---
title: Server SDKs
---

In addition to the client interactions within the room, LiveKit also exposes a set of APIs that lets you manage rooms, control the participants that are within the room, as well as to create access tokens.

These APIs are designed to be integrated into your backend code so they can interact directly with `RoomService` that's exposed by LiveKit server.

We officially support client wrappers for the following platforms. Since the service is HTTP-based, you are welcome to call it directly without using the client wrappers. RoomService is built on top of [Twirp](https://twitchtv.github.io/twirp/docs/intro.html).

| Platform | Package                                                                | Docs                                                         |
| :------- | :--------------------------------------------------------------------- | :----------------------------------------------------------- |
| Node.js  | [livekit-server-api](https://www.npmjs.com/package/livekit-server-api) | [docs](https://docs.livekit.io/server-api-js)                |
| Go       | [livekit-sdk-go](https://github.com/livekit/livekit-sdk-go)            | [docs](https://pkg.go.dev/github.com/livekit/livekit-sdk-go) |

Go server SDK also has WebRTC capabilities, allowing you to build publishing, recording, and other track interactions in your apps.
