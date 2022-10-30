#!/bin/bash

# bashのスイッチ
set -euC
WORK_DIR="/Users/serinuntius/src/github.com/noplan-inc/tokyo-web3-hackathon/docker/nginx/public";

DOMAIN=$1;

cd $WORK_DIR;

echo "mkdir $DOMAIN";
mkdir $DOMAIN;

echo "cd " $DOMAIN;
cd $DOMAIN;

echo "cp frontend";
cp -r /Users/serinuntius/src/github.com/noplan-inc/tokyo-web3-hackathon/packages/frontend/ .

echo "yarn install...";
yarn install;
echo "yarn build...";

yarn build;

# public/secretを生成するためには２回するしかないんや・・・。すまんな
yarn build;

echo "clone finish!!!"
