import type { ShooterGame } from '../game/ShooterGame'

export function installStep3EnemySpawnAndCollision(game: ShooterGame): void {
  let enemySpawnTimer = 0
  let difficultyTimer = 0
  let spawnInterval = 1.1

  game.setMessage('STEP 3: Spawn enemies and collision detection')

  game.addUpdateHandler((ctx, dt) => {
    enemySpawnTimer -= dt
    difficultyTimer += dt

    if (difficultyTimer > 8 && spawnInterval > 0.42) {
      spawnInterval -= 0.08
      difficultyTimer = 0
    }

    if (enemySpawnTimer <= 0) {
      enemySpawnTimer = spawnInterval

      const x = Math.random() * (ctx.width - 60) + 30
      const speed = Math.random() * 80 + 120
      const hp = Math.random() < 0.12 ? 3 : 1
      ctx.spawnEnemy(x, speed, hp)
    }
  })

  game.addUpdateHandler((ctx, dt) => {
    ctx.updateEnemies(dt)
  })

  game.addUpdateHandler((ctx) => {
    for (const bullet of ctx.bullets) {
      if (!bullet.alive || !bullet.fromPlayer) continue

      for (const enemy of ctx.enemies) {
        if (!enemy.alive) continue
        if (!ctx.isColliding(bullet, enemy)) continue

        bullet.alive = false
        enemy.hp -= 1
        if (enemy.hp <= 0) {
          enemy.alive = false
          ctx.addScore(100)
        }
        break
      }
    }
  })

  game.addRenderHandler((ctx) => {
    ctx.renderEnemies()
  })

  game.addRestartHandler(() => {
    enemySpawnTimer = 0
    difficultyTimer = 0
    spawnInterval = 1.1
  })
}
