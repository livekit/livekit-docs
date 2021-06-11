---
title: Performance tuning
---

LiveKit is performant and can support rooms with hundreds of participants on a single node. To achieve high performance, some tuning is necessary.

If you are deploying with our Kubernetes Helm chart, these settings will be applied automatically.

## Host networking

If running in Docker, ensure that you are using host networking. NAT and bridge mode introduce another layer of translation that could be limiting to performance.

## Kernel parameters

Several kernel parameters would need to be tuned via sysctl. By default, Linux comes with conservative settings on buffer/queue sizes that would lead to packet loss under load.

These values can be set in `/etc/sysctl.conf` (and will take effect upon next boot), or applied immediately via `sysctl`.

```ini title="/etc/sysctl.conf"
# Increase number of file handles
fs.file-max = 2097152

# Increase number of incoming connections
net.core.somaxconn = 65535

# Increase size of the receive queue
net.core.netdev_max_backlog = 65535

# Increase maximum amount of option buffer to 25M
net.core.optmem_max = 25165824

# Increase socket read and write buffer maximum to 25M
net.core.rmem_max = 25165824
net.core.wmem_max = 25165824

# Increase socket read and write buffer maximum to 1M
net.core.rmem_default = 1048576
net.core.wmem_default = 1048576
```

To apply via sysctl, use:

```shell
$ sudo sysctl -w net.core.rmem_max=25165824
net.core.rmem_max = 25165824
```
