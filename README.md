# TShooting（Sky Lance）

ブラウザで遊べる縦スクロール2Dシューティングゲームです。  
講習会向けに、参加者がファイルを順番に作って機能を追加していく構成にしています。

## 起動方法

```bash
npm install
npm run dev
```

## 講習会での進め方

### STEP 1

- 触るファイル: `src/workshop/step1PlayerMove.ts`
- 状態: 白背景に自機が表示され、移動できる

### STEP 2

- 新規作成: `src/workshop/step2PlayerShot.ts`
- 変更: `src/workshop/gameCourse.ts` に import と `installStep2PlayerShot(game)` を追加
- 目標: 自機が弾を発射できる

### STEP 3

- 新規作成: `src/workshop/step3EnemySpawnAndCollision.ts`
- 変更: `src/workshop/gameCourse.ts` に import と呼び出しを追加
- 目標: 敵がランダム出現し、敵弾なしで当たり判定を実装

### STEP 4

- 新規作成: `src/workshop/step4EnemyShot.ts`
- 変更: `src/workshop/gameCourse.ts` に import と呼び出しを追加
- 目標: 敵が弾を撃つ

### STEP 5

- 新規作成: `src/workshop/step5SpaceBackground.ts`
- 変更: `src/workshop/gameCourse.ts` に import と呼び出しを追加
- 目標: 背景を宇宙風にする

## 構成方針

- `src/workshop/gameCourse.ts` が「講習会の進行管理ファイル」です
- `src/game/ShooterGame.ts` は拡張ポイントを提供する土台です
- `src/app/createGameLayout.ts` はWeb固有処理を隠蔽し、`innerHTML` は使いません

参加者は `src/workshop` のファイル中心に実装し、ゲーム全体の主導権を持ったまま段階的に完成させられます。
