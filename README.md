# Tetris

## Description
A JavaScript tetris clone of which there already exist a gazillion. The only difference is that I
made this one 🙌🏻

I tried to keep close to the original colours, scoring system, the 7-bag random generator and board
dimensions while making it possible to play it on both desktops and mobiles. Should be fun to kill
some time on the toilet 💩

## How to play
On devices that have a keyboard you can use the arrow keys and spacebar. On touchscreen devices, you can go along
by swiping, tapping and pressing the screen. 

### Keyboard
`Left/Right` - moves a piece left and right

`Up` - rotate

`Down` - soft drop

`Spacebar` - hard drop

### Touchscreen
`Swipe left/right` - moves a piece left and right

`Swipe down` - soft drop

`Tap` - rotate

`(Longer) press` - hard drop

## Known limitations/bugs
- Bug that might occur when you try to "slide" a piece under an existing one on the last row.

## Future plans
- Implement correct scoring.
- Revise the canvas renderer for both desktop and mobile (portrait and landscape).
- [Gamepad](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API) support.