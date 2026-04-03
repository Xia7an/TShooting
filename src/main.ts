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