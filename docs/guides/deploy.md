---
title: Preparing for production
---

## Ports

LiveKit uses several ports to communicate with clients:

### HTTP/WebSocket

7880 by default. This port should be placed behind a load balancer that can terminate SSL. LiveKit services are homonegeous: any client could connect to any backend instance, regardless of the room that they are in.

### rtc.port_range_start - rtc.port_range_end

50000-60000 by default. These are the primary ports for UDP data with WebRTC clients. LiveKit advertises these ports as WebRTC host candidates (each participant in the room will use two ports). This port range needs to be open on the firewall, and directly accessible from the internet.

### rtc.tcp_port

7881 by default. This is used to support ICE over TCP, which is used when the current network does not support UDP (VPN, corporate firewalls). `rtc.tcp_port` needs to be open on the firewall, and directly accessible from the internet (not behind a load balancer).

## TURN

Some corporate firewalls block not only traffic going over UDP, but also non-TLS TCP traffic. In those cases, TURN/TLS is useful to ensure those clients could still connect. LiveKit has a TURN server built-in.

To use it, you will need a TLS certificate signed by a Certificate Authority. This port could sit behind a load balancer, or exposed directly. When not using a load balancer, `turn.tls_port` needs to be set to 443.

## Resources

The scalability of LiveKit is bound by CPU and bandwidth. We recommend running production setups on 10Gbps ethernet or faster.

When deploying on cloud providers, compute-optimized instance types are the most suitable for LiveKit.

If running in a Dockerized environment, host networking should be used for optimal performance.

## Configuration

For production deploys, we recommend using a config file. The config file could be pass in via `--config` flag, or the body of the YAML can be set as `LIVEKIT_CONFIG` environment variable.

Below is a recommend config for a production deploy. To see other customization options, see [config-sample.yaml](https://github.com/livekit/livekit-server/blob/master/config-sample.yaml)

```yaml title="config.yaml"
port: 7880
log_level: info
rtc:
  tcp_port: 7881
  port_range_start: 50000
  port_range_end: 60000
  # use_external_ip should be set to true for most cloud environments where
  # the host has a public IP address, but is not exposed to the process.
  # LiveKit will attempt to use STUN to discover the true IP, and advertise
  # that IP with its clients
  use_external_ip: true
redis:
  # redis is recommended for production deploys
  address: my-redis-server.name:6379
keys:
  # key value pairs
  # your_api_key: <api_secret>
# when enabled, LiveKit will expose prometheus metrics on :6789/metrics
#prometheus_port: 6789
turn:
  enabled: true
  # domain must match tls certificate
  domain: <turn.myhost.com>
  # defaults to 3478. If not using a load balancer, must be set to 443.
  tls_port: 3478
```

## Prometheus

When configured, LiveKit exposes Prometheus stats on an /metrics endpoint. We export metrics related to rooms, participants, and packet transmissions.

To see the list of metrics that we export, see [stats.go](https://github.com/livekit/livekit-server/blob/master/pkg/rtc/stats.go)

## Multi-node routing

If Redis is configured, LiveKit automatically switches to a distributed setup by using Redis for room data as well as a message bus. In this mode, each node periodically reports their stats to Redis; this enables them to be aware of the entire cluster and make routing decisions based on availability and load. We recommend this setup for a redundant deployment.

When a new room is created, the node that received that request is able to choose an available node from the cluster to host the room.

When a client establishes a signal connection to LiveKit, it creates a persistent WebSocket connection with one of the instances. That instance will then acts as a signaling bridge, proxying messages between the node where the room is hosted and the client.

In a multi-node setup, LiveKit can support an large number of concurrent rooms. However, there are limits to the number of participants in a room, since a room must fit on a single node (for now).
