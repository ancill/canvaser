const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576

// initial map is 70 tiles width and 40 tiles height
for (let i = 0; i < collisions.length; i += 70) {
  console.log(collisions.slice(i, 70 + i))
}

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)
const image = new Image()
const playerImage = new Image()
image.src = './img/Pellet Town.png'
playerImage.src = './img/playerDown.png'

class Sprite {
  constructor({ position, velocity, image }) {
    this.position = position
    this.velocity = velocity
    this.image = image
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

const background = new Sprite({
  position: {
    x: -1050,
    y: -800,
  },
  image: image,
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

function animate() {
  window.requestAnimationFrame(animate)
  background.draw()
  // croping starts from 0x 0y to
  c.drawImage(
    playerImage,
    0,
    0,
    playerImage.width / 4,
    playerImage.height,
    canvas.width / 2 - playerImage.width / 4 / 2,
    canvas.height / 2 - playerImage.height / 2,
    playerImage.width / 4,
    playerImage.height
  )

  if (keys.w.pressed && lastKey === 'w') background.position.y += 3
  else if (keys.s.pressed && lastKey === 's') background.position.y -= 3
  else if (keys.a.pressed && lastKey === 'a') background.position.x += 3
  else if (keys.d.pressed && lastKey === 'd') background.position.x -= 3
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
