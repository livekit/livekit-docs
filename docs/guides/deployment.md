---
title: Deploying LiveKit
---

## Kubernetes

## Increasing UDP Receive Buffer

By default, Linux limits the amount of UDP data the kernel buffers before dropping it. The default limit does not work well with WebRTC, where majority of the data exchange is over UDP.

You can inspect the current limits with the following:

```shell
$ sysctl net.core.rmem_max
net.core.rmem_max = 425984
```

We suggest setting this value 16MB, or 16,777,216 bytes. To increase the read buffer, you can change it by updating `/etc/sysctl.conf` (takes effect on reboot). We recommend increasing write buffer (wmem) as well.

```title="/etc/sysctl.conf"
net.core.rmem_max=16777216
net.core.wmem_max=16777216
```

You can also update the values immediately. Run the following as root:

```shell
$ sudo sysctl -w net.core.rmem_max=16777216
net.core.rmem_max = 16777216
$ sudo sysctl -w net.core.wmem_max=16777216
net.core.wmem_max = 16777216
```

This setting is applied automatically if you're using our Kubernetes helm chart.
