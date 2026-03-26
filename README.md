# ⚾ NEO BASEBALL

**レトロ風ブラウザ野球ゲーム**
Retro-style browser baseball game — no backend, no frameworks, just pure HTML/CSS/JS.

![screenshot](https://img.shields.io/badge/status-playable-brightgreen)
![license](https://img.shields.io/badge/license-MIT-blue)

---

## 🎮 プレイ方法 / How to Play

1. **START GAME** を押してスタート
2. チームのロースターを確認して **PLAY BALL!** を押す
3. 試合画面で **⚾ PITCH!** ボタンを押すたびに1打席進む
4. 9回終了後、試合結果が表示される
5. **PLAY AGAIN** で新しい試合を楽しめる

---

## ⚙️ ゲーム仕様

- **9回制** の試合 (同点の場合は最大3延長)
- **攻守交代** あり (表/裏)
- 毎試合 **ランダムに選手を生成** — 毎回違う展開
- 打撃結果: ヒット / 二塁打 / 三塁打 / ホームラン / 内野安打 / ゴロ / フライ / 三振 / 四球
- ゲッツー / 犠牲フライ あり
- Web Audio API による **8-bit風効果音**

### 選手能力

| 能力       | 影響                         |
|------------|------------------------------|
| ミート     | 高いほどヒット率が上がる     |
| パワー     | 高いほど長打・HR率が上がる   |
| 走力       | 高いほど内野安打・進塁有利   |
| 守備       | 投手陣の補完                 |
| 球速       | 高いほど三振が取れる         |
| 制球       | 高いほど四球が減る           |
| スタミナ   | 疲労で投球能力が低下する     |

---

## 🚀 セットアップ / Setup

```bash
npm install
npm run dev      # 開発サーバー起動 (localhost:5173)
npm run build    # dist/ に出力
npm run preview  # ビルド確認
```

---

## 🌐 GitHub Pages へのデプロイ

```bash
npm run build
# dist/ の中身を gh-pages ブランチに push するか、
# GitHub Actions でデプロイしてください。
```

GitHub Actions を使う場合は以下のワークフローを参考にしてください:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 📁 ファイル構成

```
Neo-Baseball/
├─ index.html          メインHTML
├─ package.json        Vite設定
├─ vite.config.js      ビルド設定
├─ public/
│  └─ favicon.svg
└─ src/
   ├─ main.js          エントリポイント
   ├─ style.css        全スタイル
   ├─ game/
   │  ├─ gameState.js  ゲーム状態管理
   │  ├─ gameEngine.js メインゲームループ
   │  ├─ gameLogic.js  選手生成・塁上計算
   │  ├─ matchup.js    打撃結果計算
   │  └─ inning.js     イニング管理
   ├─ data/
   │  ├─ playerNames.js 選手名プール (ここを編集して名前変更)
   │  └─ config.js      ゲーム定数
   ├─ ui/
   │  ├─ render.js      DOM更新
   │  ├─ screens.js     画面HTML生成
   │  └─ input.js       入力ハンドラ
   └─ utils/
      ├─ random.js      乱数ユーティリティ
      ├─ math.js        数学ユーティリティ
      ├─ dom.js         DOMヘルパー
      └─ sounds.js      効果音 (Web Audio API)
```

---

## 🎨 カスタマイズ

- **選手名の変更**: `src/data/playerNames.js` を編集するだけで選手名プールを差し替えられます
- **確率調整**: `src/data/config.js` の `BASE_WEIGHTS` でヒット率などを調整できます
- **チーム名**: `src/data/config.js` の `TEAM_NAMES` を編集

---

## 📜 ライセンス / License

MIT — 自由に使用・改変・再配布可能

---

*選手名はすべてフィクションです。実在の人物・団体とは関係ありません。*
*All player names are fictional. Any resemblance to real persons is coincidental.*
