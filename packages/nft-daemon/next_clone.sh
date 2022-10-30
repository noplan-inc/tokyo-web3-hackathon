#!/bin/bash

# bashのスイッチ
set -euC
WORK_DIR="tmp/site";

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

echo "clone finish!!!"