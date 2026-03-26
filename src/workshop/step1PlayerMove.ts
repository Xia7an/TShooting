import type { ShooterGame } from '../game/ShooterGame.ts'

export function installStep1PlayerMove(game: ShooterGame): void {
  game.setMessage('STEP 1: Move player with WASD / Arrow keys')

  game.addUpdateHandler((ctx, dt) => {
    let moveX = 0
    let moveY = 0

    if (ctx.isKeyPressed('ArrowLeft') || ctx.isKeyPressed('KeyA')) moveX -= 1
    if (ctx.isKeyPressed('ArrowRight') || ctx.isKeyPressed('KeyD')) moveX += 1
    if (ctx.isKeyPressed('ArrowUp') || ctx.isKeyPressed('KeyW')) moveY -= 1
    if (ctx.isKeyPressed('ArrowDown') || ctx.isKeyPressed('KeyS')) moveY += 1

    const length = Math.hypot(moveX, moveY) || 1
    ctx.player.vel.x = (moveX / length) * ctx.player.speed
    ctx.player.vel.y = (moveY / length) * ctx.player.speed
    ctx.player.update(dt)

    ctx.clampPlayerInStage()
  })
}
