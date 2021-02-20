#!/bin/sh

# abort on errors
set -e

# build dependent docs
pushd ../client-sdk-js
yarn build-docs
popd
cp -R ../client-sdk-js/docs static/client-sdk-js

pushd ../server-api-js
yarn build-docs
popd
cp -R ../server-api-js/docs static/server-api-js


GIT_USER=davidzhao DEPLOYMENT_BRANCH=main yarn deploy

cd -
