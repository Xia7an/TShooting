import './style.css'

type Vec2 = { x: number; y: number }
type PlayerRenderMode = 'svg-polygon' | 'clip-path'
const PLAYER_RENDER_MODE: PlayerRenderMode = 'svg-polygon'

class GameObject {
  pos: Vec2
  vel: Vec2
  radius: number
  alive = true

  constructor(pos: Vec2, vel: Vec2, radius: number) {
    this.pos = pos
    this.vel = vel
    this.radius = radius
  }

  update(dt: number): void {
    this.pos.x += this.vel.x * dt
    this.pos.y += this.vel.y * dt
  }
}

class Bullet extends GameObject {
  color: string
  fromPlayer: boolean

  constructor(pos: Vec2, vel: Vec2, radius: number, color: string, fromPlayer: boolean) {
    super(pos, vel, radius)
    this.color = color
    this.fromPlayer = fromPlayer
  }
}

class Player extends GameObject {
  speed = 360
  hp = 3
  shootCooldown = 0
}

class Enemy extends GameObject {
  hp: number
  fireCooldown: number

  constructor(pos: Vec2, vel: Vec2, radius: number, hp: number) {
    super(pos, vel, radius)
    this.hp = hp
    this.fireCooldown = Math.random() * 1.6 + 0.5
  }
}

class Star {
  x: number
  y: number
  size: number
  speed: number

  constructor(x: number, y: number, size: number, speed: number) {
    this.x = x
    this.y = y
    this.size = size
    this.speed = speed
  }
}

class ShooterGame {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private width = 420
  private height = 720
  private player: Player
  private bullets: Bullet[] = []
  private enemies: Enemy[] = []
  private stars: Star[] = []
  private keys = new Set<string>()
  private score = 0
  private gameOver = false
  private enemySpawnTimer = 0
  private difficultyTimer = 0
  private spawnInterval = 1.1
  private lastTime = 0
  private hudScore: HTMLElement
  private hudHp: HTMLElement
  private hudMessage: HTMLElement
  private playerSvg: SVGSVGElement
  private playerClip: HTMLDivElement
  private playerRenderMode: PlayerRenderMode = PLAYER_RENDER_MODE

  constructor() {
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
      <main class="game-shell">
        <header class="hud">
          <h1>Sky Lance</h1>
          <div class="stats">
            <span id="score">SCORE: 0</span>
            <span id="hp">HP: 3</span>
          </div>
        </header>
        <div class="game-stage">
          <canvas id="game" width="420" height="720" aria-label="2D vertical shooting game"></canvas>
          <div class="player-layer" aria-hidden="true">
            <svg id="player-svg" class="player-shape player-shape--svg" viewBox="-16 -20 32 36">
              <polygon class="player-hull" points="0,-18 13,16 0,10 -13,16" />
              <polygon class="player-core" points="0,-10 6,9 -6,9" />
            </svg>
            <div id="player-clip" class="player-shape player-shape--clip"></div>
          </div>
        </div>
        <p id="message">WASD / Arrow Keys: Move | Space: Shoot</p>
      </main>
    `

    this.canvas = document.querySelector<HTMLCanvasElement>('#game')!
    const context = this.canvas.getContext('2d')
    if (!context) {
      throw new Error('Failed to acquire 2D context')
    }
    this.ctx = context

    this.hudScore = document.querySelector<HTMLElement>('#score')!
    this.hudHp = document.querySelector<HTMLElement>('#hp')!
    this.hudMessage = document.querySelector<HTMLElement>('#message')!
    this.playerSvg = document.querySelector<SVGSVGElement>('#player-svg')!
    this.playerClip = document.querySelector<HTMLDivElement>('#player-clip')!

    this.player = new Player({ x: this.width / 2, y: this.height - 80 }, { x: 0, y: 0 }, 14)
    this.setPlayerRenderMode(this.playerRenderMode)
    this.syncPlayerVisual()

    this.createStars()
    this.bindInput()
    requestAnimationFrame((t) => this.loop(t))
  }

  private createStars(): void {
    for (let i = 0; i < 140; i += 1) {
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
    this.player = new Player({ x: this.width / 2, y: this.height - 80 }, { x: 0, y: 0 }, 14)
    this.bullets = []
    this.enemies = []
    this.score = 0
    this.gameOver = false
    this.enemySpawnTimer = 0
    this.difficultyTimer = 0
    this.spawnInterval = 1.1
    this.hudMessage.textContent = 'WASD / Arrow Keys: Move | Space: Shoot'
    this.syncPlayerVisual()
  }

  private loop(timestamp: number): void {
    const dt = Math.min((timestamp - this.lastTime) / 1000 || 0, 0.033)
    this.lastTime = timestamp

    this.update(dt)
    this.render()

    requestAnimationFrame((t) => this.loop(t))
  }

  private update(dt: number): void {
    this.updateStars(dt)
    this.syncPlayerVisual()

    if (this.gameOver) {
      return
    }

    this.handlePlayerMovement(dt)
    this.handlePlayerFire(dt)
    this.spawnEnemies(dt)
    this.updateEnemies(dt)
    this.updateBullets(dt)
    this.handleCollisions()
    this.cleanupObjects()
    this.updateHud()
  }

  private updateStars(dt: number): void {
    for (const star of this.stars) {
      star.y += star.speed * dt
      if (star.y > this.height + 2) {
        star.y = -4
        star.x = Math.random() * this.width
      }
    }
  }

  private handlePlayerMovement(dt: number): void {
    let moveX = 0
    let moveY = 0

    if (this.keys.has('ArrowLeft') || this.keys.has('KeyA')) moveX -= 1
    if (this.keys.has('ArrowRight') || this.keys.has('KeyD')) moveX += 1
    if (this.keys.has('ArrowUp') || this.keys.has('KeyW')) moveY -= 1
    if (this.keys.has('ArrowDown') || this.keys.has('KeyS')) moveY += 1

    const length = Math.hypot(moveX, moveY) || 1
    this.player.vel.x = (moveX / length) * this.player.speed
    this.player.vel.y = (moveY / length) * this.player.speed
    this.player.update(dt)

    this.player.pos.x = Math.max(20, Math.min(this.width - 20, this.player.pos.x))
    this.player.pos.y = Math.max(20, Math.min(this.height - 20, this.player.pos.y))
  }

  private handlePlayerFire(dt: number): void {
    this.player.shootCooldown -= dt

    if ((this.keys.has('Space') || this.keys.has('KeyJ')) && this.player.shootCooldown <= 0) {
      this.player.shootCooldown = 0.14
      this.bullets.push(
        new Bullet(
          { x: this.player.pos.x, y: this.player.pos.y - 18 },
          { x: 0, y: -620 },
          4,
          '#ffe082',
          true,
        ),
      )
    }
  }

  private spawnEnemies(dt: number): void {
    this.enemySpawnTimer -= dt
    this.difficultyTimer += dt

    if (this.difficultyTimer > 8 && this.spawnInterval > 0.42) {
      this.spawnInterval -= 0.08
      this.difficultyTimer = 0
    }

    if (this.enemySpawnTimer <= 0) {
      this.enemySpawnTimer = this.spawnInterval

      const x = Math.random() * (this.width - 60) + 30
      const speed = Math.random() * 80 + 120
      const hp = Math.random() < 0.12 ? 3 : 1
      const radius = hp === 3 ? 18 : 13

      this.enemies.push(new Enemy({ x, y: -24 }, { x: 0, y: speed }, radius, hp))
    }
  }

  private updateEnemies(dt: number): void {
    for (const enemy of this.enemies) {
      enemy.update(dt)
      enemy.fireCooldown -= dt

      if (enemy.fireCooldown <= 0 && enemy.pos.y < this.height * 0.75) {
        enemy.fireCooldown = Math.random() * 1.8 + 0.8
        this.bullets.push(
          new Bullet({ x: enemy.pos.x, y: enemy.pos.y + 12 }, { x: 0, y: 280 }, 5, '#ff6f91', false),
        )
      }

      if (enemy.pos.y > this.height + 36) {
        enemy.alive = false
      }
    }
  }

  private updateBullets(dt: number): void {
    for (const bullet of this.bullets) {
      bullet.update(dt)
      if (bullet.pos.y < -30 || bullet.pos.y > this.height + 30) {
        bullet.alive = false
      }
    }
  }

  private handleCollisions(): void {
    for (const bullet of this.bullets) {
      if (!bullet.alive) continue

      if (bullet.fromPlayer) {
        for (const enemy of this.enemies) {
          if (!enemy.alive) continue
          if (this.isColliding(bullet, enemy)) {
            bullet.alive = false
            enemy.hp -= 1
            if (enemy.hp <= 0) {
              enemy.alive = false
              this.score += 100
            }
            break
          }
        }
      } else if (this.isColliding(bullet, this.player)) {
        bullet.alive = false
        this.damagePlayer()
      }
    }

    for (const enemy of this.enemies) {
      if (enemy.alive && this.isColliding(enemy, this.player)) {
        enemy.alive = false
        this.damagePlayer()
      }
    }
  }

  private damagePlayer(): void {
    this.player.hp -= 1
    if (this.player.hp <= 0) {
      this.player.hp = 0
      this.gameOver = true
      this.hudMessage.textContent = 'GAME OVER - Press Enter to Restart'
    }
  }

  private cleanupObjects(): void {
    this.bullets = this.bullets.filter((b) => b.alive)
    this.enemies = this.enemies.filter((e) => e.alive)
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

  private isColliding(a: GameObject, b: GameObject): boolean {
    const dx = a.pos.x - b.pos.x
    const dy = a.pos.y - b.pos.y
    return dx * dx + dy * dy <= (a.radius + b.radius) ** 2
  }

  private render(): void {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.width, this.height)

    const gradient = ctx.createLinearGradient(0, 0, 0, this.height)
    gradient.addColorStop(0, '#061427')
    gradient.addColorStop(1, '#0d2b45')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, this.width, this.height)

    for (const star of this.stars) {
      ctx.fillStyle = 'rgba(233, 245, 255, 0.85)'
      ctx.fillRect(star.x, star.y, star.size, star.size)
    }

    for (const bullet of this.bullets) {
      ctx.beginPath()
      ctx.fillStyle = bullet.color
      ctx.arc(bullet.pos.x, bullet.pos.y, bullet.radius, 0, Math.PI * 2)
      ctx.fill()
    }

    for (const enemy of this.enemies) {
      ctx.beginPath()
      ctx.fillStyle = enemy.hp > 1 ? '#f25f5c' : '#ff9f1c'
      ctx.arc(enemy.pos.x, enemy.pos.y, enemy.radius, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#0a0f1d'
      ctx.fillRect(enemy.pos.x - 8, enemy.pos.y - 3, 16, 6)
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

new ShooterGame()
