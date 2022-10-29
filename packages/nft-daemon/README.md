# nft-daemon


## 機能
- NFTの売買が行われたら、StrapiのAPIを叩いてWriterを変更する機能
- Strapiで記事が執筆されたときにWebHookを受け取って、NextのSSGをする機能

## 依存ツール
インストール
```
cargo install --force cargo-make
```


# db

```bash
makers db-create migrate
```