#!/usr/bin/env sh

#export GITHUB_REF_NAME=v1.0.0
sed --version
sed -i "s/dev-dirty/${GITHUB_REF_NAME:-default}/g" dist/Config/app-config.js
