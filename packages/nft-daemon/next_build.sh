#!/bin/bash

# bashのスイッチ
set -euC
WORK_DIR="tmp/site";

DOMAIN=$1;


echo "cd "$WORK_DIR/$DOMAIN;
pwd;
cd "$WORK_DIR/$DOMAIN";

echo "yarn build...";
yarn build;
# public/secretを生成するためには２回するしかないんや・・・。すまんな
yarn build;


echo "build finish!!!";
