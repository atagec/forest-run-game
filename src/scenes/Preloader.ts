import Phaser from 'phaser'
import TextureKeys from '../consts/TextureKeys'
import SceneKeys from '../consts/SceneKeys'
import AnimationKeys from '../consts/AnimationKeys'


export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader)
  }

  preload() {
    this.load.image(TextureKeys.Background, 'house/rsz_origbig.png')
    // this.load.image(TextureKeys.Background, 'house/bg_repeat_340x640.png')

    this.load.atlas(
      TextureKeys.RocketMouse,
      'characters/shinobi-run.png',
      'characters/rocket-mouse.json'
    )

    this.load.image(
      TextureKeys.MouseHole,
      'house/tent.png'
    )


    this.load.image(TextureKeys.Window1, 'house/cloud_shape3_1.png')
    this.load.image(TextureKeys.Window2, 'house/cloud_shape3_2.png')
    
    this.load.image(TextureKeys.Bookcase1, 'house/mega-tree-1.png')
    this.load.image(TextureKeys.Bookcase2, 'house/mega-tree-3.png')

    this.load.image(TextureKeys.LaserEnd, 'house/dark_totem_dark_shadow5.png')
    this.load.image(TextureKeys.LaserMiddle, 'house/object_laser.png')
    
    this.load.image(TextureKeys.Coin, 'house/object_coin.png')
  }


  create() {
   
    
    this.scene.start(SceneKeys.Game)
  }
}