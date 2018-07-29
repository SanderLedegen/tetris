export default class KeyboardInput {
  constructor() {
    this.resetState()
    this.keyHandler = this.keyHandler.bind(this)
    window.addEventListener('keydown', this.keyHandler)
  }

  keyHandler(e) {
    switch (e.code) {
      case 'ArrowLeft':
        this.keysPressed.left = true
        break

      case 'ArrowRight':
        this.keysPressed.right = true
        break

      case 'ArrowUp':
        this.keysPressed.up = true
        break

      case 'ArrowDown':
        this.keysPressed.down = true
        break

      case 'Space':
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
