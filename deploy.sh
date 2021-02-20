#!/bin/sh

# abort on errors
set -e

# build dependent docs
pushd ../client-sdk-js
yarn build-docs
popd

cp -R ../client-sdk-js/docs static/client-sdk-js

GIT_USER=davidzhao DEPLOYMENT_BRANCH=main yarn deploy

cd -
