export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 22
export const BLOCK_FALL_TIME = 800
export const SHAPES = [
  [ // T-shape
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [ // Z-shape
    [2, 2, 0],
    [0, 2, 2],
    [0, 0, 0],
  ],
  [ // O-shape
    [3, 3],
    [3, 3],
  ],
  [ // S-shape
    [0, 4, 4],
    [4, 4, 0],
    [0, 0, 0],
  ],
  [ // I-shape
    [0, 0, 0, 0],
    [5, 5, 5, 5],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [ // L-shape
    [6, 0, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  [ // J-shape
    [0, 0, 7],
    [7, 7, 7],
    [0, 0, 0],
  ],
]
