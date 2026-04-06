// 自機の移動
import './style.css'


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
