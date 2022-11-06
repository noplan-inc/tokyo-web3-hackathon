# tokyo-web3-hackathon

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


### 審査やテストのためにプロジェクトにアクセスする方法など


## 動作検証するための準備

httpsがローカルでも必要になるため、自己証明書で対応する
localhostの場合のみ自己証明書でも許可するようにChromeのフラグをいじる
chrome://flags/#allow-insecure-localhost
