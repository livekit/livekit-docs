---
title: Server SDKs
---

In addition to client interactions within a room, LiveKit also exposes a set of APIs allowing you manage rooms, control participants within one, and generate access tokens.

These APIs interact directly with the `RoomService` exposed by LiveKit server, and thus, should only be invoked by your backend code.

We officially support client wrappers for the following platforms. Since the service is HTTP-based, you are welcome to call it directly without using the client wrappers. `RoomService` is built on top of [Twirp](https://twitchtv.github.io/twirp/docs/intro.html).

| Platform | Repo                                                        | Links                                                                                                            |
| :------- | :---------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| Node.js  | [server-api-js](https://github.com/livekit/server-api-js)   | [npm](https://www.npmjs.com/package/livekit-server-api) [docs](https://docs.livekit.io/server-api-js/index.html) |
| Go       | [livekit-sdk-go](https://github.com/livekit/livekit-sdk-go) | [docs](https://pkg.go.dev/github.com/livekit/livekit-sdk-go)                                                     |

:::note

The Go server SDK also has WebRTC capabilities, allowing you to build publishing, recording, and other track interactions in your apps.

:::
