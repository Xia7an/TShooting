// 自機の弾発射

import './style.css'

type Enemy = {
  x: number; y: number
  vx: number; vy: number
  radius: number
  hp: number
  alive: boolean
}

type Bullet = {
  x: number; y: number
  vx: number; vy: number
  radius: number
  color: string
  alive: boolean
}

// --- Canvas 初期化 ---
const canvas = document.getElementById('game') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!
const W = canvas.width
const H = canvas.height

// --- HUD 要素 ---
const scoreEl = document.getElementById('score')!
const hpEl = document.getElementById('hp')!

// --- ゲーム状態 ---
let playerX = W / 2
let playerY = H - 80
const playerSpeed = 360
let playerHp = 3
let score = 0

let enemies: Enemy[] = []
let bullets: Bullet[] = []
let shootCooldown = 0
let enemySpawnTimer = 0
const enemySpawnInterval = 1.1
const shotInterval = 0.14

// --- 入力管理 ---
const keys = new Set<string>() // どのキーが押されているかを管理する Set

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') e.preventDefault()
  keys.add(e.code)
})
window.addEventListener('keyup', (e) => keys.delete(e.code))


// --- 更新処理 ---
function update(dt: number) {
  // HUD 更新
  scoreEl.textContent = `SCORE: ${score}`
  hpEl.textContent = `HP: ${playerHp}`

    // プレイヤー移動
  let mx = 0, my = 0
  if (keys.has('KeyA') || keys.has('ArrowLeft')) mx -= 1
  if (keys.has('KeyD') || keys.has('ArrowRight')) mx += 1
  if (keys.has('KeyW') || keys.has('ArrowUp')) my -= 1
  if (keys.has('KeyS') || keys.has('ArrowDown')) my += 1
  const len = Math.hypot(mx, my) || 1
  playerX += (mx / len) * playerSpeed * dt
  playerY += (my / len) * playerSpeed * dt
  playerX = Math.max(20, Math.min(W - 20, playerX))
  playerY = Math.max(20, Math.min(H - 20, playerY))

  // 敵スポーン
  enemySpawnTimer -= dt
  if (enemySpawnTimer <= 0) {
    enemySpawnTimer = enemySpawnInterval
    const ex = Math.random() * (W - 60) + 30
    const speed = Math.random() * 80 + 120
    const ehp = Math.random() < 0.12 ? 3 : 1
    enemies.push({
      x: ex, y: -24,
      vx: 0, vy: speed,
      radius: ehp === 3 ? 18 : 13,
      hp: ehp, 
      alive: true,
    })
  }

  // 敵の移動
  for (const e of enemies) {
    e.x += e.vx * dt
    e.y += e.vy * dt
    if (e.y > H + 36) { e.alive = false; continue }
  }
  // 死んだ敵を除去
  enemies = enemies.filter((e) => e.alive)

  
  // プレイヤー弾発射
  shootCooldown -= dt
  if (keys.has('Space') && shootCooldown <= 0) {
    shootCooldown = shotInterval
    bullets.push({
      x: playerX, y: playerY - 18,
      vx: 0, vy: -620,
      radius: 4, color: '#ffe082',
      alive: true,
    })
  }

  // 弾移動
  for (const b of bullets) { // 弾一覧の弾を一つずつ動かす
    b.x += b.vx * dt
    b.y += b.vy * dt
    if (b.y < -30 || b.y > H + 30) b.alive = false 
  }
  
  // 死んだ弾を除去
  bullets = bullets.filter((e) => e.alive)
}

// --- 描画処理 ---
function render() {
  // 背景
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, '#061427')
  grad.addColorStop(1, '#0d2b45')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // プレイヤー（三角形）
  ctx.fillStyle = '#72ddf7'
  ctx.beginPath()
  ctx.moveTo(playerX, playerY - 18)
  ctx.lineTo(playerX + 13, playerY + 16)
  ctx.lineTo(playerX - 13, playerY + 16)
  ctx.closePath()
  ctx.fill()

  // 敵
  for (const e of enemies) {
    ctx.fillStyle = e.hp > 1 ? '#f25f5c' : '#ff9f1c'
    ctx.beginPath()
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2)
    ctx.fill()
  }

  // 弾
  for (const b of bullets) {
    ctx.fillStyle = b.color
    ctx.beginPath()
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

// --- ゲームループ ---
let lastTime = 0

function loop(timestamp: number) {
  const dt = Math.min((timestamp - lastTime) / 1000 || 0, 0.033)
  lastTime = timestamp
  update(dt)
  render()
  requestAnimationFrame(loop)
}

// すべての処理の起点: ゲームループの開始
requestAnimationFrame(loop)
