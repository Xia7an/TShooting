import './style.css'
import { ShooterGame } from './game/ShooterGame'
import { setupWorkshopCourse } from './workshop/gameCourse'

const game = new ShooterGame()
setupWorkshopCourse(game)
game.start()
