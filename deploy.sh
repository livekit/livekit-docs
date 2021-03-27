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

pushd ../client-sdk-android
./gradlew dokkaHtml
popd
rm -rf static/client-sdk-android
cp -R ../client-sdk-android/livekit-android-sdk/build/dokka/html static/client-sdk-android

pushd ../livekit-ios
make docs
popd
rm -rf static/client-sdk-ios
cp -R ../livekit-ios/Documentation static/client-sdk-ios


GIT_USER=davidzhao DEPLOYMENT_BRANCH=main yarn deploy

cd -
