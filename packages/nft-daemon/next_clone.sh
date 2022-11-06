#!/bin/bash

# bashのスイッチ
set -euC
WORK_DIR="../../docker/nginx/public";

DOMAIN=$1;

cd $WORK_DIR;

if [ -d $DOMAIN ]; then
    echo "$DOMAIN exists"
    echo "delete $DOMAIN dir"
    rm -rf $DOMAIN

    echo "mkdir $DOMAIN";
    mkdir $DOMAIN;

else
    echo "mkdir $DOMAIN";
    mkdir $DOMAIN;
fi


echo "cd " $DOMAIN;
cd $DOMAIN;

echo "cp blog";
cp -r ../../../../packages/blog/. .

echo "yarn install...";
yarn install;
echo "yarn deploy...";

yarn deploy;

# public/secretを生成するためには２回するしかないんや・・・。すまんな
yarn deploy;

echo "clone finish!!!"
