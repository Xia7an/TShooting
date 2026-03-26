import './style.css'
import { ShooterGame } from './game/ShooterGame'
import { LESSON_STEP } from './workshop/lessonConfig'

const game = new ShooterGame({ step: LESSON_STEP })
game.start()
