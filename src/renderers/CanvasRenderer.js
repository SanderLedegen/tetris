import { BOARD_HEIGHT, BOARD_WIDTH } from '../constants'

export default class CanvasRenderer {
  constructor() {
    this.canvas = document.querySelector('#canvas')
    this.ctx = this.canvas.getContext('2d')

    this.nextPieceCanvas = document.querySelector('#next-piece-canvas')
    this.ctxNextPiece = this.nextPieceCanvas.getContext('2d')

    this.spanScoreValue = document.querySelector('#score')
    this.spanLevelValue = document.querySelector('#level')

    this.resize = this.resize.bind(this)

    this.resize()

    window.addEventListener('resize', this.resize)
  }

  setBoard(board) {
    this.board = board
  }

  setNextPiece(piece) {
    this.nextPiece = piece
  }

  getCanvas() {
    return this.canvas
  }

  setMeta(meta) {
    this.spanScoreValue.innerText = meta.score
    this.spanLevelValue.innerText = meta.level
  }

  resize() {
    const canvasHeight = this.canvas.offsetHeight

    // Adjust the ratio depending on the canvas' height, which was determined by CSS.
    this.canvas.height = canvasHeight
    this.canvas.width = canvasHeight * BOARD_WIDTH / BOARD_HEIGHT

    this.blockWidth = Math.floor(this.canvas.width / BOARD_WIDTH)
    this.blockHeight = Math.floor(this.canvas.height / BOARD_HEIGHT)

    this.nextPieceCanvas.width = this.blockWidth * 4
    this.nextPieceCanvas.height = this.blockHeight * 4
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (let row = 0; row < BOARD_HEIGHT; row += 1) {
      for (let col = 0; col < BOARD_WIDTH; col += 1) {
        const fillStyle = CanvasRenderer.getColorForPieceIndex(this.board[row][col])

        this.ctx.fillStyle = fillStyle
        this.ctx.fillRect(col * this.blockWidth, row * this.blockHeight, this.blockWidth, this.blockHeight)

        // Next piece canvas
        this.ctxNextPiece.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let xrow = 0; xrow < this.nextPiece.length; xrow += 1) {
          for (let xcol = 0; xcol < this.nextPiece[xrow].length; xcol += 1) {
            this.ctxNextPiece.fillStyle = CanvasRenderer.getColorForPieceIndex(this.nextPiece[xrow][xcol])
            this.ctxNextPiece.fillRect(xcol * this.blockWidth, xrow * this.blockHeight, this.blockWidth, this.blockHeight)
          }
        }
      }
    }
  }

  static getColorForPieceIndex(index) {
    let fillStyle

    switch (index) {
      case 0:
        fillStyle = '#eee'
        break

      case 1:
        fillStyle = '#f27af2'
        break

      case 2:
        fillStyle = '#ff392f'
        break

      case 3:
        fillStyle = '#FEDD04'
        break

      case 4:
        fillStyle = '#14f414'
        break

      case 5:
        fillStyle = '#1df4f4'
        break

      case 6:
        fillStyle = '#fb9119'
        break

      case 7:
        fillStyle = '#3e3eff'
        break

      default:
        console.warn(`Unknown board value "${index}"`)
        fillStyle = '#eee'
        break
    }

    return fillStyle
  }
}
