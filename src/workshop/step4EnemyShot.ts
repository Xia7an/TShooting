import { Bullet, isColliding } from '../game/entities'
import type { ShooterGame } from '../game/ShooterGame.ts'

export function installStep4EnemyShot(game: ShooterGame): void {
  game.setMessage('STEP 4: Add enemy bullets')

  game.addUpdateHandler((ctx) => {
    for (const enemy of ctx.enemies) {
      if (!enemy.alive) continue
      if (enemy.fireCooldown > 0) continue
      if (enemy.pos.y >= ctx.height * 0.75) continue

      enemy.fireCooldown = Math.random() * 1.8 + 0.8
      ctx.bullets.push(
        new Bullet({ x: enemy.pos.x, y: enemy.pos.y + 12 }, { x: 0, y: 280 }, 5, '#ff6f91', false),
      )
    }
  })

  game.addUpdateHandler((ctx) => {
    for (const bullet of ctx.bullets) {
      if (!bullet.alive || bullet.fromPlayer) continue
      if (!isColliding(bullet, ctx.player)) continue

      bullet.alive = false
      ctx.player.hp -= 1
      if (ctx.player.hp <= 0) {
        ctx.player.hp = 0
        ctx.gameOver = true
        ctx.setMessage('GAME OVER - Press Enter to Restart')
      }
    }

    for (const enemy of ctx.enemies) {
      if (!enemy.alive) continue
      if (!isColliding(enemy, ctx.player)) continue

      enemy.alive = false
      ctx.player.hp -= 1
      if (ctx.player.hp <= 0) {
        ctx.player.hp = 0
        ctx.gameOver = true
        ctx.setMessage('GAME OVER - Press Enter to Restart')
      }
    }
  })

  game.addRestartHandler((ctx) => {
    ctx.setMessage('STEP 4: Add enemy bullets')
  })
}
