# OGP の既定画像

`public/ogp-default.jpeg`（1200×630）の元データ。サムネイルのない記事とトップの `og:image` に使う。

- `ogp.html`: サイトと同じフォント（Anybody / Silkscreen / JetBrains Mono）・配色・ヒーローの枠で組んだ 1200×630 のページ
- `circuit.svg`: 背景の回路の線（固定の乱数で作ったもの）

## 作り直し方

1. `ogp.html` をブラウザで幅 1200・高さ 630・倍率 2 で開き、フォントの読み込みを待って撮る（2400×1260）
2. 1200×630 に縮小し、`public/ogp-default.jpeg`（品質 90）と `public/ogp-default.webp` に書き出す

```bash
agent-browser set viewport 1200 630 2
agent-browser open "file://$PWD/design/ogp/ogp.html"
agent-browser screenshot ogp@2x.png
```
