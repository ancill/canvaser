const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576

// initial map is 70 tiles width and 40 tiles height
const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i))
}
const battleZoneMap = []
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZoneMap.push(battleZonesData.slice(i, 70 + i))
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

const battleZones = []
battleZoneMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      )
  })
})
console.log(battleZones)

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)
const image = new Image()
const playerUpImage = new Image()
const playerDownImage = new Image()
const playerLeftImage = new Image()
const playerRightImage = new Image()
const foregroundImage = new Image()

image.src = './img/Pellet Town.png'
playerDownImage.src = './img/playerDown.png'
playerUpImage.src = './img/playerUp.png'
playerLeftImage.src = './img/playerLeft.png'
playerRightImage.src = './img/playerRight.png'
foregroundImage.src = './img/Foreground Objects.png'

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDownImage,
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage,
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

const movables = [background, foreground, ...battleZones, ...boundaries]

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
  boundaries.forEach((boundary) => boundary.draw())
  battleZones.forEach((zone) => zone.draw())
  player.draw()
  foreground.draw()

  const collisionOnMove = ({ offsetX, offsetY, boundarieObject }) => {
    for (let i = 0; i < boundarieObject.length; i++) {
      const boundary = boundarieObject[i]
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
  // пересмотреть  https://chriscourses.com/courses/pokemon/videos/battle-activation
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const boundary = battleZones[i]
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          boundary.position.x + boundary.width
        ) -
          Math.max(player.position.x, boundary.width)) *
        (Math.min(
          player.position.y + player.height,
          boundary.position.y + boundary.height
        ) -
          Math.max(player.position.y, boundary.position.y))

      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: boundary,
        }) &&
        overlappingArea > (player.width & player.height) / 2
      ) {
        console.log('coll')

        break
      }
    }
  }

  let moving = true
  player.moving = false

  if (keys.w.pressed && lastKey === 'w') {
    player.moving = true
    player.image = player.sprites.up
    collisionOnMove({ offsetX: 0, offsetY: 3, boundarieObject: boundaries })
    if (moving) movables.forEach((mov) => (mov.position.y += 3))
  } else if (keys.s.pressed && lastKey === 's') {
    player.moving = true
    player.image = player.sprites.down
    collisionOnMove({ offsetX: 0, offsetY: -3, boundarieObject: boundaries })
    if (moving) movables.forEach((mov) => (mov.position.y -= 3))
  } else if (keys.a.pressed && lastKey === 'a') {
    player.moving = true
    player.image = player.sprites.left
    collisionOnMove({ offsetX: 3, offsetY: 0, boundarieObject: boundaries })
    if (moving) movables.forEach((mov) => (mov.position.x += 3))
  } else if (keys.d.pressed && lastKey === 'd') {
    player.moving = true
    player.image = player.sprites.right
    collisionOnMove({ offsetX: -3, offsetY: 0, boundarieObject: boundaries })
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
