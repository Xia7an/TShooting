import { Enemy, isColliding } from '../game/entities'
import type { ShooterGame } from '../game/ShooterGame.ts'

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
      const radius = hp === 3 ? 18 : 13
      ctx.enemies.push(new Enemy({ x, y: -24 }, { x: 0, y: speed }, radius, hp))
    }
  })

  game.addUpdateHandler((ctx, dt) => {
    for (const enemy of ctx.enemies) {
      enemy.update(dt)
      enemy.fireCooldown -= dt

      if (enemy.pos.y > ctx.height + 36) {
        enemy.alive = false
      }
    }
  })

  game.addUpdateHandler((ctx) => {
    for (const bullet of ctx.bullets) {
      if (!bullet.alive || !bullet.fromPlayer) continue

      for (const enemy of ctx.enemies) {
        if (!enemy.alive) continue
        if (!isColliding(bullet, enemy)) continue

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

  game.addRenderHandler((ctx, canvasCtx) => {
    for (const enemy of ctx.enemies) {
      canvasCtx.beginPath()
      canvasCtx.fillStyle = enemy.hp > 1 ? '#f25f5c' : '#ff9f1c'
      canvasCtx.arc(enemy.pos.x, enemy.pos.y, enemy.radius, 0, Math.PI * 2)
      canvasCtx.fill()

      canvasCtx.fillStyle = '#0a0f1d'
      canvasCtx.fillRect(enemy.pos.x - 8, enemy.pos.y - 3, 16, 6)
    }
  })

  game.addRestartHandler((ctx) => {
    enemySpawnTimer = 0
    difficultyTimer = 0
    spawnInterval = 1.1
    ctx.setMessage('STEP 3: Spawn enemies and collision detection')
  })
}
