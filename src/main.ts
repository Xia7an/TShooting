import './style.css'

// --- ゲーム画面を表示するための Canvas の初期化 ---
export const canvas = document.getElementById('game') as HTMLCanvasElement
export const ctx = canvas.getContext('2d')!
export const W = canvas.width
export const H = canvas.height

// --- HUD 要素の初期化 ---
export const scoreEl = document.getElementById('score')!
export const hpEl = document.getElementById('hp')!

// --- ゲーム状態の初期化 ---
export let playerX = W / 2
export let playerY = H - 80
export const playerSpeed = 360
export const playerRadius = 14
export let playerHp = 3

export let score = 0
export let gameOver = false

export function restart() {
  playerX = W / 2
  playerY = H - 80
  playerHp = 3
  score = 0
  gameOver = false
}

function update(_dt: number) {
  if (gameOver) return
}

function render() {
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, '#061427')
  grad.addColorStop(1, '#0d2b45')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  scoreEl.textContent = `SCORE: ${score}`
  hpEl.textContent = `HP: ${playerHp}`
}

let lastTime = 0

function loop(timestamp: number) {
  const dt = Math.min((timestamp - lastTime) / 1000 || 0, 0.033)
  lastTime = timestamp
  update(dt)
  render()
  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)