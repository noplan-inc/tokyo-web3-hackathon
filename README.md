# tokyo-web3-hackathon

# Webma

**ブログ運営・売買アプリ**

*LN(Lightning Network)を利用した新しい収益モデルによるブログ運営を可能にするアプリ*

## 概要

広告によって収益を生み出している従来のようなブログサイトではなく、読者がブログページへ訪れるためには支払いが必要になるような仕組みが構築されたブログ運営アプリ。

また、ブログ運営者は上記のLNによる収益に加えて、運営権をNFTにして売却・購入することも可能。


### 登場人物

- ユーザー(読者): ブログページに訪れるためには、設定された量のsatoshiをLNを利用して支払う。またブログの運営権NFT(EVM)の購入が可能

- ライター(ブログ運営者):　ユーザーがブログページを訪れるごとに収益を得る。ブログの運営権NFTの価格設定と売却が可能。

### 仕組み

<a href="https://docs.lightning.engineering/the-lightning-network/lsat/aperture">Aperture</a>というプロキシを利用し、ブログサーバーへの通信をする前に、HTTPリクエストヘッダー内に、認証トークン(<a hre="https://docs.lightning.engineering/the-lightning-network/lsat/lsat">LSAT</a>)がなければHTTP ステータス402のレスポンス(payment required)をinvoice(LNによる請求書)返す。

レスポンスに含まれるinvoiceへの支払いをLNを利用して行うと、preimageというレシートがもらえるので、それをブログのヘッダーにセットして通信すれば、Apertureが認証してくれてブログが見れるようになるという仕組み。

よってApertureが返すinvoiceへの支払いを行わなければ、ブログページへの通信もできない状態＝ブログ閲覧ができない。


## このリポジトリについて

### backend
StrapiでCMS

### frontend
blogのテンプレート。backend(strapi)からAPIで取得した記事を元にnextのSSGする

### nft-daemon
- 記事のpublish時にnextのSSGをし直す
- NFTが売買されたときに、オーナーが変わったことをStrapiに知らせる


### contracts
サイトNFTとM&Aができるコントラクト

## 詳細情報

### 使用したtech stacks

*Frontend*

- Next.js
- wagmi.sh

*Backend(blog)*
- strapi

*Backend(nftdeamon)*
- Rust


*Smartcontract*
- Solidity
- Foundry

*Lightning Network*
- aperture

### 使用したBlockchain
Ethereum, Bitcoin, Lightning Network

### deployしたContract(ExplorerでOK）


### application codeやその他のfile


### テスト手順を含むリポジトリへのリンク

アプリのURL
https://blog.2an.co/


### 審査やテストのためにプロジェクトにアクセスする方法など


## 動作検証するための準備

httpsがローカルでも必要になるため、自己証明書で対応する
localhostの場合のみ自己証明書でも許可するようにChromeのフラグをいじる
chrome://flags/#allow-insecure-localhost
