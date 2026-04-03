import './style.css'


// --- Canvas 初期化 ---
const canvas = document.getElementById('game') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!
const W = canvas.width
const H = canvas.height

// --- HUD 要素 ---
const scoreEl = document.getElementById('score')!
const hpEl = document.getElementById('hp')!