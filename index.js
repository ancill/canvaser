const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)
const image = new Image()
const playerImage = new Image()
image.src = './img/Pellet Town.png'
playerImage.src = './img/playerDown.png'

class Sprite {
  constructor({ position, velocity }) {}
}

function animate() {
  window.requestAnimationFrame(animate)
  c.drawImage(image, -1050, -800)
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
}
animate()

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      console.log(e.key)
      break
    case 's':
      console.log(e.key)
      break
    case 'a':
      console.log(e.key)
      break
    case 'd':
      console.log(e.key)
      break

    default:
      console.log('nope')
      break
  }
})
