import { BOARD_WIDTH, BOARD_HEIGHT, BLOCK_FALL_TIME, SHAPES } from './constants'
import { shuffle, initTwoDimArray } from './utils'

export default class Game {
  constructor(renderer, inputs = []) {
    this.renderer = renderer
    this.inputs = inputs

    this.board = initTwoDimArray(BOARD_HEIGHT, BOARD_WIDTH, 0)

    this.piece = null
    this.pieceIndex = null
    this.insets = {}
    this.x = 0
    this.y = 0
    this.bag = []
    this.meta = {
      score: 0,
      level: 1,
    }
    this.previousTimestamp = null

    this.renderer.setBoard(this.board)
    this.renderer.setMeta(this.meta)
    this.generateNewPiece()

    this.loop = this.loop.bind(this)
  }

  update(delta) {
    // Handle input
    const keysPressed = {
      left: false,
      right: false,
      up: false,
      down: false,
      spacebar: false,
    }

    this.inputs.forEach((input) => {
      Object.keys(keysPressed).forEach((key) => {
        keysPressed[key] = keysPressed[key] || input.getState()[key]
      })

      input.resetState()
    })

    if (keysPressed.left && this.canMoveLeft()) {
      this.moveLeft()
    } else if (keysPressed.right && this.canMoveRight()) {
      this.moveRight()
    } else if (keysPressed.down && this.canMoveDown()) {
      this.moveDown()
      this.meta.score += 1
      this.renderer.setMeta(this.meta)
    } else if (keysPressed.up && this.canRotate()) {
      this.rotate()
    } else if (keysPressed.spacebar) {
      while (this.canMoveDown()) {
        this.moveDown()
        this.meta.score += 2
        this.renderer.setMeta(this.meta)
      }
    }

    // Update the position of the current piece on the board.
    for (let row = this.insets.top; row < this.piece.length - this.insets.bottom; row += 1) {
      for (let col = 0; col < this.piece[row].length; col += 1) {
        // Only copy the tetromino's current block when it's not empty to not override something
        // already on the board.
        if (this.piece[row][col]) {
          this.board[this.y + row][this.x + col] = this.pieceIndex + 1
        }
      }
    }

    if (delta > BLOCK_FALL_TIME) {
      if (this.canMoveDown()) {
        this.moveDown()
      } else {
        this.clearPossibleLines()

        if (this.y === 0) {
          console.log('GAME OVER')
          return
        }

        this.generateNewPiece()
      }
    }
  }

  /**
   * Checks whether the current piece can be moved one place down if not obstructed.
   * @returns { boolean } returns true when there's no obstruction, false otherwise.
   */
  canMoveDown() {
    // Check whether the block is at the bottom of the board
    if (this.y + this.piece.length - this.insets.bottom >= BOARD_HEIGHT) {
      return false
    }

    // Is there nothing on the line below obstructing the block to continue falling?
    let canMoveDown = true
    for (let row = this.piece.length - this.insets.bottom - 1; row >= this.insets.top && canMoveDown; row -= 1) {
      for (let col = this.insets.left; col < this.piece[row].length && canMoveDown; col += 1) {
        const boardCell = this.board[this.y + row + 1][this.x + col]
        const pieceCell = this.piece[row][col]

        // So, neither the next spot on the board nor the current cell in the piece is empty.
        // That's only OK if that next spot contains a part of the piece from before.
        if (boardCell !== 0 && pieceCell !== 0) {
          // Oh, it's the piece's last row or the next spot isn't "ours"? Hold it right there!
          if ((row >= this.piece.length - 1) || !this.piece[row + 1][col]) {
            canMoveDown = false
          }
        }
      }
    }

    return canMoveDown
  }

  /**
   * Moves the current piece one place down and prevents ghosting.
   */
  moveDown() {
    this.y += 1

    // Prevent ghosting
    for (let row = this.insets.top; row < this.piece.length - this.insets.bottom; row += 1) {
      for (let col = 0; col < this.piece[row].length; col += 1) {
        if (this.piece[row][col]) {
          if ((row > 0 && this.piece[row - 1][col] === 0) || row === 0) {
            this.board[this.y + row - 1][this.x + col] = 0
          }
        }
      }
    }
  }

  /**
   * Checks whether the current piece can be moved one place to the left if not obstructed.
   * @returns { boolean } returns true when there's no obstruction, false otherwise.
   */
  canMoveLeft() {
    if (this.x + this.insets.left <= 0) {
      return false
    }

    // Is there nothing to the left of the piece obstructing it to move there?
    let canMoveLeft = true
    for (let col = this.insets.left; col < this.piece.length && canMoveLeft; col += 1) {
      for (let row = 0; row < this.piece.length && canMoveLeft; row += 1) {
        const boardCell = this.board[this.y + row][this.x + col - 1]
        const pieceCell = this.piece[row][col]

        if (boardCell !== 0 && pieceCell !== 0) {
          if ((col === 0) || !this.piece[row][col - 1]) {
            canMoveLeft = false
          }
        }
      }
    }

    return canMoveLeft
  }

  /**
   * Moves the current piece one place to the left and prevents ghosting.
   */
  moveLeft() {
    this.x -= 1

    // Prevent ghosting
    for (let row = this.insets.top; row < this.piece.length - this.insets.bottom; row += 1) {
      const colLength = this.piece[row].length
      for (let col = 0; col < colLength; col += 1) {
        if (this.piece[row][col]) {
          if ((col < colLength - 1 && this.piece[row][col + 1] === 0) || col === colLength - 1) {
            this.board[this.y + row][this.x + col + 1] = 0
          }
        }
      }
    }
  }

  /**
   * Checks whether the current piece can be moved one place to the right if not obstructed.
   * @returns { boolean } returns true when there's no obstruction, false otherwise.
   */
  canMoveRight() {
    if (this.x + this.piece.length - this.insets.right >= BOARD_WIDTH) {
      return false
    }

    // Is there nothing to the right of the piece obstructing it to move there?
    let canMoveRight = true
    for (let col = this.piece.length - this.insets.right - 1; col >= this.insets.left && canMoveRight; col -= 1) {
      for (let row = 0; row < this.piece.length && canMoveRight; row += 1) {
        const boardCell = this.board[this.y + row][this.x + col + 1]
        const pieceCell = this.piece[row][col]

        if (boardCell !== 0 && pieceCell !== 0) {
          if ((col >= this.piece.length - 1) || !this.piece[row][col + 1]) {
            canMoveRight = false
          }
        }
      }
    }

    return canMoveRight
  }

  /**
   * Moves the current piece one place to the right and prevents ghosting.
   */
  moveRight() {
    this.x += 1

    // Prevent ghosting
    for (let row = this.insets.top; row < this.piece.length - this.insets.bottom; row += 1) {
      for (let col = 0; col < this.piece[row].length; col += 1) {
        if (this.piece[row][col]) {
          if ((col > 0 && this.piece[row][col - 1] === 0) || col === 0) {
            this.board[this.y + row][this.x + col - 1] = 0
          }
        }
      }
    }
  }

  canRotate() {
    // TODO: Implement this method
    const rotatedPiece = this.getNextRotationForCurrentPiece()
    return !!rotatedPiece
  }

  rotate() {
    // Empty every filled cell of (still) the current piece.
    for (let row = 0; row < this.piece.length; row += 1) {
      for (let col = 0; col < this.piece[row].length; col += 1) {
        if (this.piece[row][col]) {
          this.board[this.y + row][this.x + col] = 0
        }
      }
    }

    this.piece = this.getNextRotationForCurrentPiece()
    this.insets = this.calculateInsets()
  }

  getNextRotationForCurrentPiece() {
    const rotatedPiece = initTwoDimArray(this.piece.length, this.piece.length, 0)

    // Rotate the piece 90° clock-wise.
    for (let row = 0; row < this.piece.length; row += 1) {
      for (let col = 0; col < this.piece[row].length; col += 1) {
        rotatedPiece[col][this.piece.length - row - 1] = this.piece[row][col]
      }
    }

    return rotatedPiece
  }

  generateNewPiece() {
    this.ensureBagIsNotEmpty();

    [this.pieceIndex] = this.bag.splice(0, 1)
    this.piece = SHAPES[this.pieceIndex]

    // Ensure the bag is not empty once more to get the next piece.
    this.ensureBagIsNotEmpty()

    this.renderer.setNextPiece(SHAPES[this.bag.slice(0, 1)])

    this.y = 0
    this.x = Math.floor((BOARD_WIDTH - this.piece.length) / 2)
    this.insets = this.calculateInsets()
  }

  ensureBagIsNotEmpty() {
    if (!this.bag || this.bag.length === 0) {
      this.bag = shuffle(Array(SHAPES.length).fill(0).map((val, i) => i))
    }
  }

  clearPossibleLines() {
    if (!this.canMoveDown()) {
      let numOfClearedLines = 0

      for (let row = this.board.length - 1; row >= 0; row -= 1) {
        const fullLine = this.board[row].every(cell => cell !== 0)
        if (fullLine) {
          this.board = [
            Array(BOARD_WIDTH).fill(0),
            ...this.board.slice(0, row),
            ...this.board.slice(row + 1),
          ]

          numOfClearedLines += 1

          row = this.board.length

          this.renderer.setBoard(this.board)
          this.renderer.setMeta(this.meta)
        }
      }

      if (numOfClearedLines) {
        let score = 0

        switch (numOfClearedLines) {
          case 1:
            score = 40 * this.meta.level
            break

          case 2:
            score = 100 * this.meta.level
            break

          case 3:
            score = 300 * this.meta.level
            break

          case 4:
            score = 1200 * this.meta.level
            break

          default:
            console.warn('So you cleared more than 4 lines, huh? 🤔')
        }

        this.meta.score += score
        this.renderer.setMeta(this.meta)
        this.generateNewPiece()
      }
    }
  }

  calculateInsets() {
    const insets = {
      bottom: null,
      top: null,
      left: null,
      right: null,
    }

    // Calculate bottom inset
    for (let y = this.piece.length - 1; y >= 0 && insets.bottom === null; y -= 1) {
      const emptyRow = this.piece[y].every(value => value === 0)
      if (!emptyRow) {
        insets.bottom = this.piece.length - y - 1
      }
    }

    // Calculate top inset
    for (let y = 0; y < this.piece.length && insets.top === null; y += 1) {
      const emptyRow = this.piece[y].every(value => value === 0)
      if (!emptyRow) {
        insets.top = y
      }
    }

    // Calculate left inset
    for (let x = 0; x < this.piece[0].length && insets.left === null; x += 1) {
      const emptyCol = this.piece.map(i => i[x]).every(value => value === 0)
      if (!emptyCol) {
        insets.left = x
      }
    }

    // Calculate right inset
    for (let x = this.piece[0].length - 1; x >= 0 && insets.right === null; x -= 1) {
      const emptyCol = this.piece.map(i => i[x]).every(value => value === 0)
      if (!emptyCol) {
        insets.right = this.piece[0].length - x - 1
      }
    }

    return insets
  }

  loop(timestamp) {
    this.previousTimestamp = this.previousTimestamp || timestamp

    const delta = timestamp - this.previousTimestamp

    this.update(delta)
    this.renderer.render()

    if (delta > BLOCK_FALL_TIME) {
      this.previousTimestamp = timestamp
    }

    window.requestAnimationFrame(this.loop)
  }

  start() {
    this.loop()
  }
}
