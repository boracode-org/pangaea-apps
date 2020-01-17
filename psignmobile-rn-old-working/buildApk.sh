#!/bin/bash
exp publish --clear
# exp build:android
pushd android && ./gradlew assembleRelease && popd
