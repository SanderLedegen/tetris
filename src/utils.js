export function shuffle(array) {
  // Implementation of Fisher & Yates shuffle algorithm
  // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  let counter = array.length

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter)

    counter -= 1

    const temp = array[counter]
    array[counter] = array[index] // eslint-disable-line no-param-reassign
    array[index] = temp // eslint-disable-line no-param-reassign
  }

  return array
}

export function initTwoDimArray(rows, cols, initialValue = 0) {
  return Array(rows).fill(initialValue).map(() => Array(cols || rows).fill(initialValue))
}
