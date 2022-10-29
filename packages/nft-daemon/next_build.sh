#!/bin/bash

# bashのスイッチ
set -euC
WORK_DIR="tmp/site";

DOMAIN=$1;


echo "cd "$WORK_DIR/$DOMAIN;
cd "$WORK_DIR/$DOMAIN";

echo "yarn build...";
yarn build;

echo "finish!!!";