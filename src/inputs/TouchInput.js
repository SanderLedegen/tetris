import Hammer from 'hammerjs'

export default class TouchInput {
  constructor(element) {
    this.resetState()

    const elementTouch = new Hammer(element)
    elementTouch.get('swipe').set({
      direction: Hammer.DIRECTION_ALL,
      threshold: 2,
      velocity: 0.3,
    })

    this.touchHandler = this.touchHandler.bind(this)
    elementTouch.on('swipeleft swiperight swipeup swipedown tap press', this.touchHandler)
  }

  touchHandler(e) {
    switch (e.type) {
      case 'swipeleft':
        this.keysPressed.left = true
        break

      case 'swiperight':
        this.keysPressed.right = true
        break

      case 'swipedown':
        this.keysPressed.down = true
        break

      case 'swipeup':
      case 'tap':
        this.keysPressed.up = true
        break

      case 'press':
        this.keysPressed.spacebar = true
        break

      default:
        break
    }
  }

  getState() {
    return this.keysPressed
  }

  resetState() {
    this.keysPressed = {
      left: false,
      right: false,
      up: false,
      down: false,
      spacebar: false,
    }
  }
}
