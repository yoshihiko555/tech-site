# Plans

## Project: カテゴリー/タグ ページネーション バグ修正

### Phase 1: 修正 `cc:done`

#### Tasks

- `cc:done` 要件整理（原因: `pageChange` の遷移先 URL からスラッグが消え、`params.slug` が undefined になるため Contentful 取得が空 → 真っ白）
- `cc:done` 実装計画の作成（URL を `/categories/:slug/page/:page`, `/tags/:slug/page/:page` に変更）
- `cc:done` `nuxt.config.ts` の `extendRoutes` を新 URL に差し替え
- `cc:done` `pages/categories/_slug.vue` の `pageChange` 修正
- `cc:done` `pages/tags/_slug.vue` の `pageChange` 修正
- `cc:done` `nuxt.config.ts` の `sitemap.exclude` を新パターンに調整
- `cc:done` `eslint` で検証（変更ファイルにエラーなし）

### Phase 2: フォローアップ `cc:TODO`

- `cc:TODO` SSG 事前生成（`generate.routes` に各カテゴリー/タグのページネーション URL を追加）— 別タスク化

---

## Decisions

- 2026-04-08: ページネーション URL をスラッグ保持型 `/categories/:slug/page/:page` に変更（旧 `/categories/page/:page` はスラッグ喪失によりバグの原因）
- 2026-04-08: SSG の `generate.routes` への追加は Phase 2 に切り出し、まずは最小修正で挙動復旧を優先

## Notes

- `fallback: true` のため SSG 未生成でも SPA フォールバックで動作する想定
- 旧 URL `/categories/page/N` への外部リンクは基本無いと想定（ブックマーク程度）
