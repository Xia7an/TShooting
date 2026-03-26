import type { ShooterGame } from '../game/ShooterGame'

export function installStep5SpaceBackground(game: ShooterGame): void {
  game.setMessage('STEP 5: Build space-like background')

  game.createStars(140)

  game.addUpdateHandler((ctx, dt) => {
    ctx.updateStars(dt)
  })

  game.setBackgroundRenderer((ctx, canvasCtx) => {
    const gradient = canvasCtx.createLinearGradient(0, 0, 0, ctx.height)
    gradient.addColorStop(0, '#061427')
    gradient.addColorStop(1, '#0d2b45')
    canvasCtx.fillStyle = gradient
    canvasCtx.fillRect(0, 0, ctx.width, ctx.height)

    ctx.renderStars()
  })
}
