export type Vec2 = { x: number; y: number }

export class GameObject {
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

export class Bullet extends GameObject {
  color: string
  fromPlayer: boolean

  constructor(pos: Vec2, vel: Vec2, radius: number, color: string, fromPlayer: boolean) {
    super(pos, vel, radius)
    this.color = color
    this.fromPlayer = fromPlayer
  }
}

export class Player extends GameObject {
  speed = 360
  hp = 3
  shootCooldown = 0
}

export class Enemy extends GameObject {
  hp: number
  fireCooldown: number

  constructor(pos: Vec2, vel: Vec2, radius: number, hp: number) {
    super(pos, vel, radius)
    this.hp = hp
    this.fireCooldown = Math.random() * 1.6 + 0.5
  }
}

export class Star {
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

export function isColliding(a: GameObject, b: GameObject): boolean {
  const dx = a.pos.x - b.pos.x
  const dy = a.pos.y - b.pos.y
  return dx * dx + dy * dy <= (a.radius + b.radius) ** 2
}
