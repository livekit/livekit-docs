---
title: RoomService SDKs
---

In addition to the client interactions within the room, LiveKit also exposes a set of [Twirp](https://twitchtv.github.io/twirp/docs/intro.html)-based APIs that lets you manage rooms, control the participants that are within the room, as well as to create access tokens.

These APIs are designed to be integrated into your backend code, and they can interact directly with `RoomService` that's exposed by LiveKit server.

We officially support client wrappers for the following platforms

| Platform | Package                                                                | Docs                                          |
| :------- | :--------------------------------------------------------------------- | :-------------------------------------------- |
| Node.js  | [livekit-server-api](https://www.npmjs.com/package/livekit-server-api) | [docs](https://docs.livekit.io/server-api-js) |
