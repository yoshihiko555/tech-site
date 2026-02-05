# tech-site

**概要**: 技術ブログサイト（Contentful CMS + Nuxt.js）

---

## Tech Stack

- **Language**: TypeScript
- **Framework**: Nuxt.js 2 (Vue 2)
- **Package Manager**: Yarn
- **CMS**: Contentful (GraphQL API)
- **Styling**: Tailwind CSS + SCSS
- **Deployment**: Vercel

---

## Commands

```bash
# 依存関係インストール
yarn install

# 開発サーバー起動
yarn dev

# ビルド
yarn build

# 本番サーバー起動
yarn start

# 静的サイト生成
yarn generate

# リント（JS + Style）
yarn lint

# JSのみリント
yarn lint:js

# スタイルのみリント
yarn lint:style

# GraphQL 型生成
yarn codegen

# Contentful 型生成
yarn contentful-codegen

# キャッシュクリア
yarn clean
```

---

## Project Structure

```
.
├── @types/           # 型定義
├── assets/           # SCSS、画像等
├── components/       # Vue コンポーネント（Atomic Design）
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
├── config/           # 設定ファイル（codegen等）
├── generated/        # 自動生成された型定義
├── graphql/          # GraphQL クエリ
├── layouts/          # Nuxt レイアウト
├── pages/            # ページコンポーネント
├── plugins/          # Nuxt プラグイン
├── static/           # 静的ファイル
├── store/            # Vuex ストア
└── utils/            # ユーティリティ関数
```

---

## Coding Conventions

- Atomic Design に従ったコンポーネント設計
- スタイルは Tailwind CSS を優先、必要に応じて SCSS
- GraphQL クエリは `graphql/` に配置
- 型定義は codegen で自動生成

---

## Environment Variables

`.env` ファイルに以下を設定:
- Contentful API キー
- その他 API 設定

---

## Notes

- Nuxt 2 + Composition API を使用
- Contentful からブログ記事を取得
- Vercel でホスティング
