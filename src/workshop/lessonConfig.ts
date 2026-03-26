export type LessonStep = 1 | 2 | 3 | 4 | 5

export const LESSON_STEP: LessonStep = 5

export type LessonFeatures = {
  playerFire: boolean
  spawnEnemies: boolean
  collision: boolean
  enemyFire: boolean
  spaceBackground: boolean
}

export function getLessonFeatures(step: LessonStep): LessonFeatures {
  return {
    playerFire: step >= 2,
    spawnEnemies: step >= 3,
    collision: step >= 3,
    enemyFire: step >= 4,
    spaceBackground: step >= 5,
  }
}

export function getLessonMessage(step: LessonStep): string {
  if (step === 1) return 'STEP 1: Move player with WASD / Arrow keys'
  if (step === 2) return 'STEP 2: Add player bullets with Space key'
  if (step === 3) return 'STEP 3: Spawn enemies and collision detection'
  if (step === 4) return 'STEP 4: Add enemy bullets'
  return 'STEP 5: Build space-like background'
}
