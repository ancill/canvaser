const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576

// initial map is 70 tiles width and 40 tiles height
const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i))
}

const boundaries = []
const offset = {
  x: -1050,
  y: -850,
}

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      )
  })
})
console.log(collisionsMap)
c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)
const image = new Image()
const playerImage = new Image()
const playerUpImage = new Image()
const foregroundImage = new Image()

image.src = './img/Pellet Town.png'
playerImage.src = './img/playerDown.png'
foregroundImage.src = './img/Foreground Objects.png'

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerImage,
  sprites: {
    up: playerUpImage,
  },
  frames: {
    max: 4,
  },
})
const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
})

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
})

const keys = {
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

const movables = [background, foreground, ...boundaries]

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  )
}

function animate() {
  window.requestAnimationFrame(animate)
  background.draw()

  boundaries.forEach((boundary) => {
    boundary.draw()
  })
  player.draw()
  foreground.draw()
  let moving = true

  const collisionOnMove = (offsetX, offsetY) => {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + offsetX,
              y: boundary.position.y + offsetY,
            },
          },
        })
      ) {
        console.log('coll')
        moving = false
        break
      }
    }
  }

  player.moving = false

  if (keys.w.pressed && lastKey === 'w') {
    player.moving = true
    collisionOnMove(0, 3)
    if (moving) movables.forEach((mov) => (mov.position.y += 3))
  } else if (keys.s.pressed && lastKey === 's') {
    player.moving = true
    collisionOnMove(0, -3)
    if (moving) movables.forEach((mov) => (mov.position.y -= 3))
  } else if (keys.a.pressed && lastKey === 'a') {
    player.moving = true
    collisionOnMove(3, 0)
    if (moving) movables.forEach((mov) => (mov.position.x += 3))
  } else if (keys.d.pressed && lastKey === 'd') {
    player.moving = true
    collisionOnMove(-3, 0)
    if (moving) movables.forEach((mov) => (mov.position.x -= 3))
  }
}
animate()

let lastKey = ''
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true
      lastKey = 'w'
      break
    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
      break
    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break

    default:
      console.log('nope')
      break
  }
})

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break

    default:
      console.log('nope')
      break
  }
})
