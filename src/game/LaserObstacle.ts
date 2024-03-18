import Phaser from 'phaser'
import TextureKeys from '../consts/TextureKeys'

export default class LaserObstacle extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    // create a top
    const top = scene.add.image(0, 0, TextureKeys.LaserEnd) 
        .setOrigin(0.5, 0)

    top.setDisplaySize(60, 60)

    // create a middle and set it below the top
    const middle1 = scene.add.image(
      0,
      top.y + top.displayHeight - 25,
      TextureKeys.LaserMiddle
    )
    .setOrigin(0.5, 0)

    // set height of middle laster to 200px
    // middle.setDisplaySize(middle.width, 200)
    middle1.setDisplaySize(60, 100)

    const middle2 = scene.add.image(
      0,
      middle1.y + middle1.displayHeight,
      TextureKeys.LaserMiddle
    )
    .setOrigin(0.5, 0)
    .setFlipY(true)

    middle2.setDisplaySize(60, 100)


    // create a bottom that is flipped and below the middle
    const bottom = scene.add.image(0,  middle2.y + middle2.displayHeight -25 , TextureKeys.LaserEnd)
        .setOrigin(0.5, 0)
        .setFlipY(true)
    bottom.setDisplaySize(60, 60)

    // add them all to the Container
    this.add(top)
    this.add(middle1)
    this.add(bottom)
    this.add(middle2)


    scene.physics.add.existing(this, true)

    const body = this.body as Phaser.Physics.Arcade.StaticBody
    const width = top.displayWidth
    const height = top.displayHeight + middle1.displayHeight + middle2.displayHeight + bottom.displayHeight - 50

    body.setSize(width, height)
    body.setOffset(-width * 0.5, 0)

    // DO: LASER COLLISION BOX WILL BE ADJUSTED

    // reposition body
    body.position.x = this.x + body.offset.x
    body.position.y = this.y
  }
}