//17:25開始
// 17:34 step1完了
// 17:43 step2完了。 どのメソッドいじるか書いておくとわかりやすいかも
// step3 22ページのコードの変化前が違うから修正する。 23ページの変化後のコードのfromPlayerは存在しないから消す
// 17:51 step3完了
// 17:59 step4完了
// step5 30ページの変化後のコードのハイライトが間違っている。
// step5 30ページにHP=0でgameOver = trueに変更するコードが掲載されていないから掲載する。
// step5 32ページのisHit関数の実装が違うから修正する
// step5 33ページでlocalhost:5173を開くよう指示を書く
// 18:10 step5 完了


// 自機の移動
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
const playerRadius = 8
let playerHp = 3
let score = 0

let enemies: Enemy[] = []
let enemySpawnTimer = 0
const enemySpawnInterval = 0.1

let bullets: Bullet[] = []
let shootCooldown = 0
const shotInterval = 0.1
let timer = 0

let gameOver = false

// --- 入力管理 ---
const keys = new Set<string>() // どのキーが押されているかを管理する Set

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') e.preventDefault()
  if ( gameOver && e.code === 'Enter') {restart(); return }
  keys.add(e.code)
})
window.addEventListener('keyup', (e) => keys.delete(e.code))

function isHit(ax: number, ay: number, ar: number, bx: number, by: number, br: number): boolean {
  const dx = ax - bx
  const dy = ay - by
  
  return Math.sqrt(dx * dx + dy * dy) <= (ar + br)
}

function restart(){
  playerX = W / 2
  playerY = H - 80
  playerHp = 3
  shootCooldown = 0
  bullets = []
  enemies = []
  score = 0
  gameOver = false
  enemySpawnTimer = 0
}

// --- 更新処理 ---
function update(dt: number) {
  timer += dt
  // HUD 更新
  scoreEl.textContent = `SCORE: ${score}`
  hpEl.textContent = `HP: ${playerHp}`

  if (gameOver) return

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
  if (enemySpawnTimer <= 0){
    enemySpawnTimer = enemySpawnInterval
    const ex = Math.random() * (W - 60) + 30
    const speed = Math.random() * 100 + 150
    const ehp = Math.random() < 0.12 ? 3 : 1
    const dist = Math.hypot(playerX - ex, playerY + 24)
    enemies.push({
      x: ex, y: -24,
      vx: (playerX - ex) / dist * speed, vy: (playerY + 24) / dist * speed,
      radius: ehp === 3 ? 18 : 13,
      hp: ehp,
      alive: true,
    })
  }

  // 敵の移動
  for (const e of enemies){
    e.x += e.vx * dt
    e.y += e.vy * dt
    if (e.y > H + 36) { e.alive = false; continue} // 画面外に移動したら死んだ判定
  }

  // 死んだ敵を除去
  enemies = enemies.filter((e) => e.alive)

  // プレイヤー弾発射
  shootCooldown -= dt
  if (keys.has('Space') && shootCooldown <= 0) {
    shootCooldown = shotInterval
    bullets.push({
      x: playerX, y: playerY - 18,
      vx: 0, vy: -650,
      radius: 4, color: "#ffe082",
      alive: true
    })
  }

  // 弾移動
  for (const b of bullets) { 
    b.x += b.vx * dt
    b.y += b.vy * dt
    if (b.y < -30 || b.y > H + 30) b.alive = false
  }

  // 死んだ弾を除去
  bullets = bullets.filter((e) => e.alive)

  // 弾 → 敵 衝突
  for (const b of bullets) { 
    if(!b.alive) continue
    for (const e of enemies) {
      if (!e.alive) continue
      if(isHit(b.x, b.y, b.radius, e.x, e.y, e.radius)) {
        b.alive = false
        e.hp -= 1
        if (e.hp <= 0) { e.alive = false; score += 100}
        break
      }
    }
  }

  // 敵 → 自機 衝突
  for (const e of enemies){
    if (!e.alive) continue
    if (isHit(e.x, e.y, e.radius, playerX, playerY, playerRadius)) {
      e.alive = false
      playerHp -= 1
      if (playerHp <= 0) {gameOver = true; break}
    }
  }
}

// --- 描画処理 ---
function render() {
  // 背景
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, '#061427')
  grad.addColorStop(1, '#0d2b45')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // プレイヤー (三角形)
  ctx.fillStyle = '#72ddf7'
  ctx.beginPath()
  ctx.moveTo(playerX, playerY - 18)
  ctx.lineTo(playerX + 13, playerY + 16)
  ctx.lineTo(playerX - 13, playerY + 16)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#ff3333'
  ctx.beginPath()
  ctx.arc(playerX, playerY, playerRadius, 0, Math.PI * 2)
  ctx.fill()
  
  // 敵
  for (const e of enemies){
    ctx.fillStyle = e.hp > 1 ? "#f25f5c" : "#ff9f1c"
    ctx.beginPath()
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2)
    ctx.fill()
  }

  // 弾
  for (const b of bullets){
    ctx.fillStyle = b.color
    ctx.beginPath()
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
    ctx.fill()
  }

  // ゲームオーバー画面
  if (gameOver) {
    ctx.fillStyle = 'rgba(4, 8, 18, 0.52)'
    ctx.fillRect(0, 0, W, H) // 画面全体を塗りつぶす

    ctx.fillStyle = '#f8f4e3'
    ctx.font = '700 42px "Trebuchet MS", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('GAME OVER', W / 2, H / 2 -20)

    ctx.font = '600 22px "Trebuchet MS", sans-serif'
    ctx.fillText(`SCORE: ${score}`, W / 2, H / 2 + 22)

    ctx.font = '400 16px "Trebuchet MS", sans-serif'
    ctx.fillText('Press Enter to Restart', W / 2, H / 2 + 56)
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
