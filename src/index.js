import Game from './Game'
import CanvasRenderer from './renderers/CanvasRenderer'
import KeyboardInput from './inputs/KeyboardInput'
import TouchInput from './inputs/TouchInput'

const renderer = new CanvasRenderer()

const keyboardInput = new KeyboardInput()
const touchInput = new TouchInput(renderer.getCanvas())

const game = new Game(renderer, [keyboardInput, touchInput])
game.start()
