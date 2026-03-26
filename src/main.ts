import './style.css'
import { ShooterGame } from './game/ShooterGame.ts'
import { setupWorkshopCourse } from './workshop/gameCourse'

const game = new ShooterGame()
setupWorkshopCourse(game)
game.start()
