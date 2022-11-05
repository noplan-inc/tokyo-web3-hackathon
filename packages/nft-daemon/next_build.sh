#!/bin/bash

# bashのスイッチ
set -euC
WORK_DIR="../../docker/nginx/public";

DOMAIN=$1;


echo "cd "$WORK_DIR/$DOMAIN;
pwd;
cd "$WORK_DIR/$DOMAIN";

echo "yarn deploy...";
yarn deploy;
# public/secretを生成するためには２回するしかないんや・・・。すまんな
yarn deploy;


echo "build finish!!!";
