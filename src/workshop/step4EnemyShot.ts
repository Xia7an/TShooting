import type { ShooterGame } from '../game/ShooterGame'

export function installStep4EnemyShot(game: ShooterGame): void {
  game.setMessage('STEP 4: Add enemy bullets')

  game.addUpdateHandler((ctx) => {
    for (const enemy of ctx.enemies) {
      if (!enemy.alive) continue
      if (enemy.fireCooldown > 0) continue
      if (enemy.pos.y >= ctx.height * 0.75) continue

      enemy.fireCooldown = Math.random() * 1.8 + 0.8
      ctx.spawnEnemyBullet(enemy)
    }
  })

  game.addUpdateHandler((ctx) => {
    for (const bullet of ctx.bullets) {
      if (!bullet.alive || bullet.fromPlayer) continue
      if (!ctx.isColliding(bullet, ctx.player)) continue

      bullet.alive = false
      ctx.damagePlayer(1)
    }

    for (const enemy of ctx.enemies) {
      if (!enemy.alive) continue
      if (!ctx.isColliding(enemy, ctx.player)) continue

      enemy.alive = false
      ctx.damagePlayer(1)
    }
  })
}
