import type { ShooterGame } from '../game/ShooterGame.ts'
import { installStep1PlayerMove } from './step1PlayerMove'
import { installStep2PlayerShot } from './step2PlayerShot'
import { installStep3EnemySpawnAndCollision } from './step3EnemySpawnAndCollision'
import { installStep4EnemyShot } from './step4EnemyShot'
import { installStep5SpaceBackground } from './step5SpaceBackground'

export function setupWorkshopCourse(game: ShooterGame): void {
  installStep1PlayerMove(game)

  // STEP 2:
  // 1) 新しく `src/workshop/step2PlayerShot.ts` を作る
  // 2) ここで import する
  // 3) installStep2PlayerShot(game) を呼ぶ
  installStep2PlayerShot(game)

  // STEP 3:
  // 1) `src/workshop/step3EnemySpawnAndCollision.ts` を作る
  // 2) ここで import して呼ぶ
  installStep3EnemySpawnAndCollision(game)

  // STEP 4:
  // 1) `src/workshop/step4EnemyShot.ts` を作る
  // 2) ここで import して呼ぶ
  installStep4EnemyShot(game)

  // STEP 5:
  // 1) `src/workshop/step5SpaceBackground.ts` を作る
  // 2) ここで import して呼ぶ
  installStep5SpaceBackground(game)
}
