# オリエンテーション委員会公式サイト用ヘッドレスCMS
オリエンテーション委員会公式サイト用ヘッドレスCMS Markdownエディタ

## 環境構築（ローカル開発）
### 環境変数の用意
しかるべき場所から以下を入手し、レポジトリのホームディレクトリに`.env.local`として保存してください。
```shell
NEXT_PUBLIC_API_URL=
```

### 依存パッケージのインストール
```shell
npm i
```

### 起動
```shell
npm run dev
```
でポート番号 `localhost:11024` が動作します。

## npm scripts
```shell
# 開発環境の立ち上げ
npm run dev

# ビルド
npm run build

# ESLintを一部ファイルに作用させる
npm run lint
```
