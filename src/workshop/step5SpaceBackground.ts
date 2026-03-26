import { Star } from '../game/entities'
import type { ShooterGame } from '../game/ShooterGame.ts'

export function installStep5SpaceBackground(game: ShooterGame): void {
  game.setMessage('STEP 5: Build space-like background')

  game.stars = []
  for (let i = 0; i < 140; i += 1) {
    game.stars.push(
      new Star(
        Math.random() * game.width,
        Math.random() * game.height,
        Math.random() * 2 + 0.4,
        Math.random() * 70 + 30,
      ),
    )
  }

  game.addUpdateHandler((ctx, dt) => {
    for (const star of ctx.stars) {
      star.y += star.speed * dt
      if (star.y > ctx.height + 2) {
        star.y = -4
        star.x = Math.random() * ctx.width
      }
    }
  })

  game.setBackgroundRenderer((ctx, canvasCtx) => {
    const gradient = canvasCtx.createLinearGradient(0, 0, 0, ctx.height)
    gradient.addColorStop(0, '#061427')
    gradient.addColorStop(1, '#0d2b45')
    canvasCtx.fillStyle = gradient
    canvasCtx.fillRect(0, 0, ctx.width, ctx.height)

    for (const star of ctx.stars) {
      canvasCtx.fillStyle = 'rgba(233, 245, 255, 0.85)'
      canvasCtx.fillRect(star.x, star.y, star.size, star.size)
    }
  })

  game.addRestartHandler((ctx) => {
    ctx.setMessage('STEP 5: Build space-like background')
  })
}
