# TShooting（Sky Lance）

ブラウザで遊べる縦スクロール2Dシューティングゲームです。  
講習会向けに、ゲーム機能を段階的に増やせる構成へリファクタリングしています。

## 起動方法

```bash
npm install
npm run dev
```

## 講習会で触るファイル

- `src/workshop/lessonConfig.ts`

`LESSON_STEP` を変更することで、実装段階を切り替えられます。

- `1`: 白背景 + 自機移動
- `2`: 自機弾の発射
- `3`: 敵出現 + 弾/敵の当たり判定
- `4`: 敵弾の発射
- `5`: 宇宙風背景（完成版）

## ファイル構成の意図

- `src/main.ts` : 起動だけを行う最小のエントリポイント
- `src/workshop/lessonConfig.ts` : 講習会で操作する段階設定
- `src/game/ShooterGame.ts` : ゲーム進行の本体
- `src/game/entities.ts` : 位置や速度などゲームオブジェクトの基礎
- `src/app/createGameLayout.ts` : Web固有のDOM構築（`innerHTML` 不使用）

Web APIの細かい扱いは `src/app` 側に寄せ、講習会ではTypeScriptのゲームロジックに集中しやすくしています。
