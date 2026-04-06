import './style.css'


// --- ゲーム状態の初期化 ---
export let playerX = W / 2
export let playerY = H - 80
export const playerSpeed = 360
export const playerRadius = 14
export let playerHp = 3

export let score = 0
export let gameOver = false

// --- ゲーム状態 ---
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
}

function render() {
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, '#061427')
  grad.addColorStop(1, '#0d2b45')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)
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