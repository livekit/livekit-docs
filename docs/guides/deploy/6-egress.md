---
title: Egress Service
---

The egress service only requires access to the same redis cluster as your LiveKit server.

## Config

The Egress service takes a yaml config file:

```yaml
# required fields
api_key: livekit server api key. LIVEKIT_API_KEY env can be used instead
api_secret: livekit server api secret. LIVEKIT_API_SECRET env can be used instead
ws_url: livekit server websocket url. LIVEKIT_WS_URL can be used instead
redis:
  address: must be the same redis address used by your livekit server
  username: redis username
  password: redis password
  db: redis db

# optional fields
health_port: if used, will open an http port for health checks
prometheus_port: port used to collect prometheus metrics. Used for autoscaling
log_level: debug, info, warn, or error (default info)
template_base: can be used to host custom templates (default https://recorder.livekit.io/#)
insecure: can be used to connect to an insecure websocket (default false)

# file upload config - only one of the following. Can be overridden per-request
s3:
  access_key: AWS_ACCESS_KEY_ID env can be used instead
  secret: AWS_SECRET_ACCESS_KEY env can be used instead
  region: AWS_DEFAULT_REGION env can be used instead
  endpoint: optional custom endpoint
  bucket: bucket to upload files to
azure:
  account_name: AZURE_STORAGE_ACCOUNT env can be used instead
  account_key: AZURE_STORAGE_KEY env can be used instead
  container_name: container to upload files to
gcp:
  credentials_json: GOOGLE_APPLICATION_CREDENTIALS env can be used instead
  bucket: bucket to upload files to
```

The config file can be added to a mounted volume with its location passed in the EGRESS_CONFIG_FILE env var, or its body can be passed in the EGRESS_CONFIG_BODY env var.

## Version Compatibility

Egress is still in beta and subject to change. The following versions are compatible:

| livekit-egress | protocol | livekit-server | server-sdk-go | server-sdk-js | livekit-cli |
|----------------|----------|----------------|---------------|---------------|-------------|
| v0.4+          | v0.13.0+ | v0.15.7+       | v0.9.3+       | v0.5.11+      | v0.7.2+     |

## Ensuring availability

The `livekit_egress_available` Prometheus metric is provided to support autoscaling. `prometheus_port` must be defined in your config.

## Helm

If you already deployed the server using our Helm chart, jump to `helm install` below.

Ensure [Helm](https://helm.sh/docs/intro/install/) is installed on your machine.

Add the LiveKit repo

```shell
$ helm repo add livekit https://helm.livekit.io
```

Create a values.yaml for your deployment, using [egress-sample.yaml](https://github.com/livekit/livekit-helm/blob/master/egress-sample.yaml) as a template.
Each instance can record one room at a time, so be sure to either enable autoscaling, or set replicaCount >= the number of rooms you'll need to simultaneously record.

Then install the chart

```shell
$ helm install <instance_name> livekit/livekit-egress --namespace <namespace> --values values.yaml
```

We'll publish new version of the chart with new recorder releases. To fetch these updates and upgrade your installation, perform

```shell
$ helm repo update
$ helm upgrade <instance_name> livekit/livekit-egress --namespace <namespace> --values values.yaml
```
