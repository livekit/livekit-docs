#!/bin/sh

# abort on errors
set -e

# build dependent docs
pushd ../client-sdk-js
yarn build-docs
popd
rm -rf static/client-sdk-js
cp -R ../client-sdk-js/docs static/client-sdk-js

pushd ../server-api-js
yarn build-docs
popd
rm -rf static/server-api-js
cp -R ../server-api-js/docs static/server-api-js


GIT_USER=davidzhao DEPLOYMENT_BRANCH=main yarn deploy

cd -
