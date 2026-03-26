import { Bullet } from '../game/entities'
import type { ShooterGame } from '../game/ShooterGame.ts'

export function installStep2PlayerShot(game: ShooterGame): void {
  game.setMessage('STEP 2: Add player bullets with Space key')

  game.addUpdateHandler((ctx, dt) => {
    ctx.player.shootCooldown -= dt

    if ((ctx.isKeyPressed('Space') || ctx.isKeyPressed('KeyJ')) && ctx.player.shootCooldown <= 0) {
      ctx.player.shootCooldown = 0.14
      ctx.bullets.push(
        new Bullet(
          { x: ctx.player.pos.x, y: ctx.player.pos.y - 18 },
          { x: 0, y: -620 },
          4,
          '#ffe082',
          true,
        ),
      )
    }
  })

  game.addUpdateHandler((ctx, dt) => {
    for (const bullet of ctx.bullets) {
      bullet.update(dt)

      if (bullet.pos.y < -30 || bullet.pos.y > ctx.height + 30) {
        bullet.alive = false
      }
    }
  })

  game.addRenderHandler((ctx, canvasCtx) => {
    for (const bullet of ctx.bullets) {
      canvasCtx.beginPath()
      canvasCtx.fillStyle = bullet.color
      canvasCtx.arc(bullet.pos.x, bullet.pos.y, bullet.radius, 0, Math.PI * 2)
      canvasCtx.fill()
    }
  })

  game.addRestartHandler((ctx) => {
    ctx.setMessage('STEP 2: Add player bullets with Space key')
  })
}
