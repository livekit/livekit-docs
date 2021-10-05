---
title: Simple Cloud Instance
---

# LiveKit Server Deployment

This document covers setting up LiveKit Server instance. Prerequesits are:
  - A valid self-generated LiveKit API key, following the instructions in the [Getting Started](/guides/getting-started#generate-api-key-and-secret) guide.
  - A valid SSL certificate and private key, which can be purchased anywhere that sells SSL certificates such as [Namecheap](https://www.namecheap.com/security/ssl-certificates/).
  - Ability to add a DNS record pointing to your new LiveKit Server.

## Deployment
You have the choice of deploying LiveKit using [Cloud Init](#cloud-init) or with a [Custom Built Cloud Image](#custom-built-cloud-image). All custom configuration can go into the Cloud Init config, or you can SSH into your LiveKit server instance after it has been created in order to set configuration files. The LiveKit `config.yaml` file is located at `/opt/livekit-server/config.yaml`.

If you prefer to deploy LiveKit on Kubernetes, see the [Kubernetes guide](/guides/deploy/kubernetes) instead.

### Cloud Init
This is the easiest method for deploying LiveKit Server. You can deploy a LiveKit Server using a vanilla Linux image and Cloud Init configuration file.

#### AWS EC2

LiveKit Server can be deployed with either Amazon Linux 2 or Ubuntu. Use the `cloud-init.<platform>.yaml` file corresponding to your desired platform:
  - For Amazon Linux 2, use [cloud-init.amzn2.yaml](https://raw.githubusercontent.com/livekit/livekit-server/master/deploy/cloud-init.amzn2.yaml)
  - For Ubuntu, use [cloud-init.ubuntu.yaml](https://raw.githubusercontent.com/livekit/livekit-server/master/deploy/cloud-init.ubuntu.yaml)

Steps: 
  1. Download one of the above `cloud-init.<platform>.yaml` files. Edit it to include your LiveKit Server configuration, SSL certificate, and SSL private key.
  2. Open the [AWS Console](https://console.aws.amazon.com/ec2) and navigate to EC2.
  3. Launch an instance.
  4. Choose the latest "Amazon Linux 2" or "Ubuntu Server" AMI.
  5. In the "Step 3: Configure Instance Details" screen, copy and paste text from your modified `cloud-init.yaml` file from step 1 into the "User data" field, under the "Advanced Details" section.
  6. Launch your instance as usual.
  
#### Digital Ocean Droplet
Steps: 
  1. Download the [cloud-init.ubuntu.yaml](https://raw.githubusercontent.com/livekit/livekit-server/master/deploy/cloud-init.ubuntu.yaml) file. Edit it to include your LiveKit Server configuration, SSL certificate, and SSL private key.
  2. Log on to Digital Ocean and navigate to [Droplets](https://cloud.digitalocean.com/droplets).
  3. Create a Droplet.
  4. Choose the latest "Ubuntu" image.
  5. Under "Select additional options" section, check the "User data" option. Copy and paste text from your modified `cloud-init.ubuntu.yaml` file from step 1 into the "User data" field, under the "Advanced Details" section.
  6. Launch your droplet as usual.

### Custom Built Cloud Image
You can build your own custom cloud image, and bake in any configuration you like.

#### AWS EC2

##### Amazon Linux 2
  1. [Install Packer](https://learn.hashicorp.com/tutorials/packer/get-started-install-cli)
  2. Edit [config.pkr.hcl](https://raw.githubusercontent.com/livekit/livekit-server/master/deploy/config.pkr.hcl), [config.yaml](https://raw.githubusercontent.com/livekit/livekit-server/master/deploy/config.yaml), `server.crt`, and `server.pem` files and keep them in the same directory.
  3. Build your AMI:
```
cd livekit-server/deploy
packer build .
```
  4. Open the [AWS Console](https://console.aws.amazon.com/ec2) and navigate to EC2.
  5. Launch an instance.
  6. Choose custom built AMI.
  7. Launch your instance as usual.

## Firewall
After you have [deployed](#deployment) LiveKit using one of the methods above, make sure your AWS Security Group is configured to allow the following ports to your LiveKit Instance:
  - TCP 22   - SSH
  - TPC 443  - SSL terminated WebSocket
  - TCP 7880 - Plaintext WebSocket
  - TCP 7881 - RTC TCP
  - UDP 7882 - RTC UDP

## Troubleshooting
If something is not working as expected, SSH in to your server and use the following commands to investigate:
```
systemctl status docker.service
systemctl status nginx.service
systemctl status docker.livekit-server@v0.13.service
tail /var/log/nginx/access.log
tail /var/log/nginx/error.log
```
