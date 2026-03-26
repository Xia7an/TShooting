import type { ShooterGame } from '../game/ShooterGame'

export function installStep2PlayerShot(game: ShooterGame): void {
  game.setMessage('STEP 2: Add player bullets with Space key')

  game.addUpdateHandler((ctx, dt) => {
    ctx.player.shootCooldown -= dt

    if ((ctx.isKeyPressed('Space') || ctx.isKeyPressed('KeyJ')) && ctx.player.shootCooldown <= 0) {
      ctx.player.shootCooldown = 0.14
      ctx.spawnPlayerBullet()
    }
  })

  game.addUpdateHandler((ctx, dt) => {
    ctx.updateBullets(dt)
  })

  game.addRenderHandler((ctx) => {
    ctx.renderBullets()
  })
}
