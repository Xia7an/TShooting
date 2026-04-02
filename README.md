# TShooting（Sky Lance）

ブラウザで遊べる縦スクロール2Dシューティングゲームです。  
講習会向けに、参加者が通常のアプリ開発と同じく「モジュール（クラス）を作成して import する」流れで機能を追加できる構成にしています。

## 起動方法

```bash
npm install
npm run dev
```

## 講習会のファイル分割（4種類）

### 1. 自機に関する処理

- `src/game/playerFeature.ts`
- 自機移動・自機弾の発射/更新/描画をまとめています

### 2. 敵キャラに関する処理（敵弾を含む）

- `src/game/enemyFeature.ts`
- 敵出現・敵更新・当たり判定・敵弾の発射/被弾処理をまとめています

### 3. 背景に関する処理

- `src/game/backgroundFeature.ts`
- 宇宙背景（星の生成/更新/描画）をまとめています

### 4. 参加者が触らない基盤（イベント/描画/HTML寄り）

- `src/game/ShooterGame.ts`
- `src/app/createGameLayout.ts`

`ShooterGame.ts` はゲームループ、入力イベント処理、HUD更新、Canvas描画の土台に限定しています。

## 講習会での進行

- 機能追加は `src/main.ts` に import とインスタンス生成を追加して進めます
- STEPごとの目安は以下の通りです

1. `new PlayerMovementFeature()`
2. `new PlayerShootingFeature()`
3. `new EnemySpawnCollisionFeature()`
4. `new EnemyShootingFeature()`
5. `new SpaceBackgroundFeature()`

例: 新しい機能を作るときは `src/game/xxxFeature.ts` を作成し、`src/main.ts` で import して `new XxxFeature()` を `ShooterGame` に渡します。
