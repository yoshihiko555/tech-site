# tech-site

**概要**: 技術ブログ兼ポートフォリオ（yoshihiko.tech）。Contentful の記事を Nuxt で静的生成し、Vercel で配信する

---

## Tech Stack

- **Language**: TypeScript
- **Framework**: Nuxt 4（Vue 3、`app/` 構成）。静的生成（`nuxt generate`）
- **Runtime / Package Manager**: Node 24（mise）/ Yarn 1
- **CMS**: Contentful（GraphQL Content API）。build 時に取得し、クライアントには認証情報を出さない
- **Markdown**: markdown-it + markdown-it-anchor + Shiki（build 時に HTML 化）。mermaid は client で描画
- **SEO**: `@nuxtjs/sitemap`、`/feed.xml`（`feed`）、`useSeoMeta`、`nuxt-gtag`
- **Styling**: 新デザインの実装時に決める（Tailwind は外した）
- **Test / Lint**: Vitest、`@nuxt/eslint`、`nuxt typecheck`
- **Deployment**: Vercel（`vercel.json` は `buildCommand: yarn generate` のみ）

---

## Commands

```bash
# 依存関係インストール（postinstall で nuxt prepare が走る）
yarn install

# 開発サーバー起動（.env が必要）
yarn dev

# 静的サイト生成（出力: .output/public）
yarn generate

# 生成物をローカルで確認
yarn preview

# 単体テスト（test/unit/）
yarn test

# 型チェック
yarn typecheck

# リント
yarn lint

# 旧サイトの URL がすべて生成されたか確認（yarn generate の後）
yarn check:routes

# GraphQL の型生成（generated/graphql.schema.json から。認証情報は不要）
yarn codegen
```

- `.env` を読むコマンド（`dev` / `generate` / `typecheck` / `nuxt prepare`）は、Claude Code のサンドボックス内では `.env` の読み取りが禁止されているため失敗する。サンドボックス外で実行する
- Docker は不要。`Dockerfile` / `docker-compose.yml` は Nuxt 2 時代のもので、Nuxt 4 では動作を確認していない

---

## Project Structure

```
.
├── app/                    # Nuxt アプリ（画面）
│   ├── app.vue
│   ├── components/         # PostListing / TermListing など
│   ├── composables/        # usePostIndex（全記事と分類）
│   ├── pages/              # /, /blog, /blog/[slug], /categories/[slug], /tags/[slug] と各 /page/[page]
│   ├── plugins/            # mermaid.client.ts
│   └── utils/              # pagination（1 ページ 8 件）
├── server/
│   ├── api/                # /api/posts, /api/posts/[slug]（prerender 時に呼ばれ payload に入る）
│   ├── routes/feed.xml.ts  # RSS
│   └── utils/              # contentful（GraphQL）, posts（取得と組み立て）, markdown（HTML 化）
├── shared/types/           # app と server で共有する型（#shared/types/post）
├── graphql/queries/        # Contentful の GraphQL クエリ
├── generated/              # codegen の出力とスキーマ（graphql.schema.json）
├── public/                 # 静的ファイル（favicon、OGP 画像、robots.txt、作品画像、旧 SW を消す sw.js）
├── scripts/                # check-routes.mjs と旧サイトの sitemap（fixtures/）
├── test/unit/              # Vitest
└── design/logo/            # 新ロゴの SVG / PNG
```

---

## Coding Conventions

- Contentful のデータ取得は `server/` に置き、ページは `/api/*` を `useFetch` で読む
- 判定や加工のロジックは純粋な関数として切り出し、`test/unit/` でテストする（例: `selectRelated`、`parsePageParam`）
- GraphQL クエリは `graphql/queries/` に置き、型は `yarn codegen` で生成する（生成物は手で編集しない）
- 今のサイトの URL（`/blog/page/:n` などのページ送りを含む）を変えない。変える場合は `nuxt.config.ts` の `routeRules` で転送する

---

## Environment Variables

`.env`（手元）と Vercel の環境変数に設定する:

- `CTF_ENDPOINT` / `CTF_CDA_TOKEN`: Contentful GraphQL のエンドポイントと Content Delivery トークン
- `ORIGIN`: サイトの URL（本番は `https://yoshihiko.tech`）。sitemap / RSS / OGP の URL に使う
- `GTAG_ID`: Google アナリティクス（空なら読み込まない）

---

## Notes

- 静的生成のため、記事を追加・更新したら再デプロイで反映する
- `/about` `/works` `/contact` は廃止し、`routeRules` で 301 転送している
- 旧 PWA の service worker は `public/sw.js` で解除している。消さないこと
- Vercel の環境変数 `NODE_OPTIONS=--openssl-legacy-provider` は Nuxt 2 用。不要になったので外す

---

## Current Project: Nuxt 4 移行とサイト刷新

- Phase 1（土台、今の URL・SEO の引き継ぎ）: PR #35
- Phase 2: 試作（トップ・記事・一覧）どおりの新デザインを実装。配色はオレンジ、カーソルは照準
- Phase 3: Vercel プレビューで確認し、`NODE_OPTIONS` を外してから develop → master
- 注意: develop → master は本番に出る。Phase 1 だけが入った develop を master に出すと、デザインのない画面が公開される（#35 のマージ時期は未決）
