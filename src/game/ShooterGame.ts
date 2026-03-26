import { createGameLayout } from '../app/createGameLayout'
import { Bullet, Enemy, Player, Star, isColliding } from './entities'

type PlayerRenderMode = 'svg-polygon' | 'clip-path'
const PLAYER_RENDER_MODE: PlayerRenderMode = 'svg-polygon'

type UpdateHandler = (game: ShooterGame, dt: number) => void
type RenderHandler = (game: ShooterGame, ctx: CanvasRenderingContext2D) => void
type RestartHandler = (game: ShooterGame) => void
type BackgroundRenderer = (game: ShooterGame, ctx: CanvasRenderingContext2D) => void

export class ShooterGame {
  readonly canvas: HTMLCanvasElement
  readonly ctx: CanvasRenderingContext2D
  readonly width = 420
  readonly height = 720

  readonly player: Player
  bullets: Bullet[] = []
  enemies: Enemy[] = []
  stars: Star[] = []
  readonly keys = new Set<string>()

  score = 0
  gameOver = false

  private lastTime = 0
  private hudScore: HTMLElement
  private hudHp: HTMLElement
  private hudMessage: HTMLElement
  private playerSvg: SVGSVGElement
  private playerClip: HTMLDivElement
  private playerRenderMode: PlayerRenderMode = PLAYER_RENDER_MODE

  private updateHandlers: UpdateHandler[] = []
  private renderHandlers: RenderHandler[] = []
  private restartHandlers: RestartHandler[] = []

  private backgroundRenderer: BackgroundRenderer = (_game, ctx) => {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, this.width, this.height)
  }

  constructor() {
    const layout = createGameLayout()
    this.canvas = layout.canvas

    const context = this.canvas.getContext('2d')
    if (!context) {
      throw new Error('Failed to acquire 2D context')
    }
    this.ctx = context

    this.hudScore = layout.score
    this.hudHp = layout.hp
    this.hudMessage = layout.message
    this.playerSvg = layout.playerSvg
    this.playerClip = layout.playerClip

    this.player = new Player({ x: this.width / 2, y: this.height - 80 }, { x: 0, y: 0 }, 14)

    this.setPlayerRenderMode(this.playerRenderMode)
    this.syncPlayerVisual()

    this.bindInput()
    this.updateHud()
  }

  start(): void {
    requestAnimationFrame((t) => this.loop(t))
  }

  addUpdateHandler(handler: UpdateHandler): void {
    this.updateHandlers.push(handler)
  }

  addRenderHandler(handler: RenderHandler): void {
    this.renderHandlers.push(handler)
  }

  addRestartHandler(handler: RestartHandler): void {
    this.restartHandlers.push(handler)
  }

  setMessage(text: string): void {
    this.hudMessage.textContent = text
  }

  setBackgroundRenderer(renderer: BackgroundRenderer): void {
    this.backgroundRenderer = renderer
  }

  isKeyPressed(code: string): boolean {
    return this.keys.has(code)
  }

  clampPlayerInStage(): void {
    this.player.pos.x = Math.max(20, Math.min(this.width - 20, this.player.pos.x))
    this.player.pos.y = Math.max(20, Math.min(this.height - 20, this.player.pos.y))
  }

  addScore(points: number): void {
    this.score += points
  }

  damagePlayer(amount = 1): void {
    this.player.hp -= amount
    if (this.player.hp <= 0) {
      this.player.hp = 0
      this.gameOver = true
      this.hudMessage.textContent = 'GAME OVER - Press Enter to Restart'
    }
  }

  spawnPlayerBullet(speed = 620): void {
    this.bullets.push(
      new Bullet(
        { x: this.player.pos.x, y: this.player.pos.y - 18 },
        { x: 0, y: -speed },
        4,
        '#ffe082',
        true,
      ),
    )
  }

  spawnEnemyBullet(enemy: Enemy, speed = 280): void {
    this.bullets.push(
      new Bullet({ x: enemy.pos.x, y: enemy.pos.y + 12 }, { x: 0, y: speed }, 5, '#ff6f91', false),
    )
  }

  spawnEnemy(posX: number, speedY: number, hp: number): void {
    const radius = hp === 3 ? 18 : 13
    this.enemies.push(new Enemy({ x: posX, y: -24 }, { x: 0, y: speedY }, radius, hp))
  }

  updateBullets(dt: number): void {
    for (const bullet of this.bullets) {
      bullet.update(dt)
      if (bullet.pos.y < -30 || bullet.pos.y > this.height + 30) {
        bullet.alive = false
      }
    }
  }

  updateEnemies(dt: number): void {
    for (const enemy of this.enemies) {
      enemy.update(dt)
      enemy.fireCooldown -= dt

      if (enemy.pos.y > this.height + 36) {
        enemy.alive = false
      }
    }
  }

  cleanupObjects(): void {
    this.bullets = this.bullets.filter((b) => b.alive)
    this.enemies = this.enemies.filter((e) => e.alive)
  }

  isColliding = isColliding

  renderBullets(): void {
    for (const bullet of this.bullets) {
      this.ctx.beginPath()
      this.ctx.fillStyle = bullet.color
      this.ctx.arc(bullet.pos.x, bullet.pos.y, bullet.radius, 0, Math.PI * 2)
      this.ctx.fill()
    }
  }

  renderEnemies(): void {
    for (const enemy of this.enemies) {
      this.ctx.beginPath()
      this.ctx.fillStyle = enemy.hp > 1 ? '#f25f5c' : '#ff9f1c'
      this.ctx.arc(enemy.pos.x, enemy.pos.y, enemy.radius, 0, Math.PI * 2)
      this.ctx.fill()

      this.ctx.fillStyle = '#0a0f1d'
      this.ctx.fillRect(enemy.pos.x - 8, enemy.pos.y - 3, 16, 6)
    }
  }

  createStars(count: number): void {
    this.stars = []
    for (let i = 0; i < count; i += 1) {
      this.stars.push(
        new Star(
          Math.random() * this.width,
          Math.random() * this.height,
          Math.random() * 2 + 0.4,
          Math.random() * 70 + 30,
        ),
      )
    }
  }

  updateStars(dt: number): void {
    for (const star of this.stars) {
      star.y += star.speed * dt
      if (star.y > this.height + 2) {
        star.y = -4
        star.x = Math.random() * this.width
      }
    }
  }

  renderStars(): void {
    for (const star of this.stars) {
      this.ctx.fillStyle = 'rgba(233, 245, 255, 0.85)'
      this.ctx.fillRect(star.x, star.y, star.size, star.size)
    }
  }

  private bindInput(): void {
    window.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        event.preventDefault()
      }

      if (this.gameOver && event.code === 'Enter') {
        this.restart()
        return
      }

      this.keys.add(event.code)
    })

    window.addEventListener('keyup', (event) => {
      this.keys.delete(event.code)
    })
  }

  private restart(): void {
    this.player.pos.x = this.width / 2
    this.player.pos.y = this.height - 80
    this.player.vel.x = 0
    this.player.vel.y = 0
    this.player.hp = 3
    this.player.shootCooldown = 0

    this.bullets = []
    this.enemies = []
    this.score = 0
    this.gameOver = false

    for (const handler of this.restartHandlers) {
      handler(this)
    }

    this.syncPlayerVisual()
    this.updateHud()
  }

  private loop(timestamp: number): void {
    const dt = Math.min((timestamp - this.lastTime) / 1000 || 0, 0.033)
    this.lastTime = timestamp

    this.update(dt)
    this.render()

    requestAnimationFrame((t) => this.loop(t))
  }

  private update(dt: number): void {
    this.syncPlayerVisual()

    if (this.gameOver) {
      return
    }

    for (const handler of this.updateHandlers) {
      handler(this, dt)
    }

    this.cleanupObjects()
    this.updateHud()
  }

  private updateHud(): void {
    this.hudScore.textContent = `SCORE: ${this.score}`
    this.hudHp.textContent = `HP: ${this.player.hp}`
  }

  private setPlayerRenderMode(mode: PlayerRenderMode): void {
    this.playerRenderMode = mode
    const showSvg = mode === 'svg-polygon'
    this.playerSvg.classList.toggle('is-active', showSvg)
    this.playerClip.classList.toggle('is-active', !showSvg)
  }

  private syncPlayerVisual(): void {
    const scaleX = this.canvas.clientWidth / this.width
    const scaleY = this.canvas.clientHeight / this.height
    const x = this.player.pos.x * scaleX
    const y = this.player.pos.y * scaleY
    const scale = Math.min(scaleX, scaleY)
    const transform = `translate(-50%, -50%) scale(${scale})`

    this.playerSvg.style.left = `${x}px`
    this.playerSvg.style.top = `${y}px`
    this.playerSvg.style.transform = transform

    this.playerClip.style.left = `${x}px`
    this.playerClip.style.top = `${y}px`
    this.playerClip.style.transform = transform
  }

  private render(): void {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.width, this.height)

    this.backgroundRenderer(this, ctx)

    for (const handler of this.renderHandlers) {
      handler(this, ctx)
    }

    if (this.gameOver) {
      ctx.fillStyle = 'rgba(4, 8, 18, 0.52)'
      ctx.fillRect(0, 0, this.width, this.height)

      ctx.fillStyle = '#f8f4e3'
      ctx.font = '700 42px "Trebuchet MS", "Verdana", sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 20)

      ctx.font = '600 22px "Trebuchet MS", "Verdana", sans-serif'
      ctx.fillText(`SCORE: ${this.score}`, this.width / 2, this.height / 2 + 22)
    }
  }
}
