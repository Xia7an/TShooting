type LayoutRefs = {
  canvas: HTMLCanvasElement
  score: HTMLElement
  hp: HTMLElement
  message: HTMLElement
  playerSvg: SVGSVGElement
  playerClip: HTMLDivElement
}

function requireById<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id)
  if (!element) {
    throw new Error(`Element not found: #${id}`)
  }
  return element as T
}

function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName)
  if (className) {
    element.className = className
  }
  return element
}

export function createGameLayout(): LayoutRefs {
  const app = requireById<HTMLDivElement>('app')
  app.replaceChildren()

  const main = createElement('main', 'game-shell')
  const header = createElement('header', 'hud')

  const title = createElement('h1')
  title.textContent = 'Sky Lance'

  const stats = createElement('div', 'stats')
  const score = createElement('span')
  score.id = 'score'
  score.textContent = 'SCORE: 0'

  const hp = createElement('span')
  hp.id = 'hp'
  hp.textContent = 'HP: 3'

  stats.append(score, hp)
  header.append(title, stats)

  const stage = createElement('div', 'game-stage')
  const canvas = createElement('canvas')
  canvas.id = 'game'
  canvas.width = 420
  canvas.height = 720
  canvas.setAttribute('aria-label', '2D vertical shooting game')

  const playerLayer = createElement('div', 'player-layer')
  playerLayer.setAttribute('aria-hidden', 'true')

  const svgNS = 'http://www.w3.org/2000/svg'
  const playerSvg = document.createElementNS(svgNS, 'svg')
  playerSvg.id = 'player-svg'
  playerSvg.classList.add('player-shape', 'player-shape--svg')
  playerSvg.setAttribute('viewBox', '-16 -20 32 36')

  const hull = document.createElementNS(svgNS, 'polygon')
  hull.classList.add('player-hull')
  hull.setAttribute('points', '0,-18 13,16 0,10 -13,16')

  const core = document.createElementNS(svgNS, 'polygon')
  core.classList.add('player-core')
  core.setAttribute('points', '0,-10 6,9 -6,9')

  playerSvg.append(hull, core)

  const playerClip = createElement('div', 'player-shape player-shape--clip')
  playerClip.id = 'player-clip'

  playerLayer.append(playerSvg, playerClip)
  stage.append(canvas, playerLayer)

  const message = createElement('p')
  message.id = 'message'

  main.append(header, stage, message)
  app.append(main)

  return {
    canvas,
    score,
    hp,
    message,
    playerSvg,
    playerClip,
  }
}
