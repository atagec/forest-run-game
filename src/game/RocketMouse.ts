enum MouseState {
  Running,
  Killed,
  Dead
}



import Phaser from 'phaser'
import TextureKeys from '../consts/TextureKeys'
import AnimationKeys from '../consts/AnimationKeys'
import SceneKeys from '../consts/SceneKeys'

export default class RocketMouse extends Phaser.GameObjects.Container {
  private flames: Phaser.GameObjects.Sprite
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private mouse: Phaser.GameObjects.Sprite
  private mouseState = MouseState.Running


  enableJetPack(enabled: boolean) {
    this.flames.setVisible(enabled)
  }

  kill() {
    // don't do anything if not in RUNNING state
    if (this.mouseState !== MouseState.Running) {
      return;
    }

    // set state to KILLED
    this.mouseState = MouseState.Killed
    
    this.mouse.play(AnimationKeys.RocketMouseDead) 

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setAccelerationY(0)
    body.setVelocity(1000, 0)
    this.enableJetPack(false)
  }

  private createAnimations() {
     // run animation
     this.mouse.anims.create({
      key: AnimationKeys.RocketMouseRun,  // name of the animation
      frames: this.mouse.anims.generateFrameNames(TextureKeys.RocketMouse, {
        start: 1,
        end: 4,
        prefix: 'rocketmouse_run',
        zeroPad: 2,  // zeroPad is necessary if the animation has more than 9 frames
        suffix: '.png'
      }),
      frameRate: 10,
      repeat: -1 // -1 to loop forever
    })


    // fall animation
    this.mouse.anims.create({
      key: AnimationKeys.RocketMouseFall,
      frames: [{
        key: TextureKeys.RocketMouse,
        frame: 'rocketmouse_fall01.png'
      }]
    })



    // new fly animation
    this.mouse.anims.create({
      key: AnimationKeys.RocketMouseFly,
      frames: [{
        key: TextureKeys.RocketMouse,
        frame: 'rocketmouse_fly01.png'
      }]
    })

    // create the flames
    this.mouse.anims.create({
      key: AnimationKeys.RocketFlamesOn,
      frames: this.mouse.anims.generateFrameNames(TextureKeys.RocketMouse,
        {start: 1, end: 2, prefix: 'flame', suffix: '.png'}
        ),
      frameRate: 10,
      repeat: -1
    })

    this.mouse.anims.create({
      key: AnimationKeys.RocketMouseDead,
      frames: this.mouse.anims.generateFrameNames(TextureKeys.RocketMouse, {
        start: 1,
        end: 2,
        prefix: 'rocketmouse_dead',
        zeroPad: 2,
        suffix: '.png'
      }),
      frameRate: 10
    })
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)


    // create the rocket mouse sprite
    this.mouse = scene.add.sprite(0, 0, TextureKeys.RocketMouse)
        .setOrigin(0.5, 1)
        // .play(AnimationKeys.RocketMouseRun)


    // create the flames and play the animation
    this.flames = scene.add.sprite(-63, -15, TextureKeys.RocketMouse)
      // .play(AnimationKeys.RocketFlamesOn)
    
    this.createAnimations()
    this.mouse.play(AnimationKeys.RocketMouseRun)
    this.flames.play(AnimationKeys.RocketFlamesOn)
    
    this.enableJetPack(false)


    this.cursors = scene.input.keyboard.createCursorKeys()

  
     // add this first so it is under the mouse sprite
    this.add(this.flames)
    this.add(this.mouse)

    // add a physics body
    scene.physics.add.existing(this)

    // adjust physics body size and offset
    const body = this.body as Phaser.Physics.Arcade.Body

    // // use the half width and 70% of height
    // body.setSize(this.mouse.width * 0.5, this.mouse.height * 0.7)
    // // adjust offset to match
    // body.setOffset(this.mouse.width * -0.3, -this.mouse.height + 15)
     // use the half width and 70% of height
     body.setSize(this.mouse.width * 0.3, this.mouse.height * 0.6)
     // adjust offset to match
     body.setOffset(this.mouse.width * -0.2, -this.mouse.height + 50)

  }

  preUpdate() {
    const body = this.body as Phaser.Physics.Arcade.Body

    // switch on this.mouseState
    switch (this.mouseState) {
      case MouseState.Running:
        {

          // check is Space bar is down
          if (this.cursors.space?.isDown) {
            // set y acceleration to -600 if so
            body.setAccelerationY(-1000)
            this.enableJetPack(true)
      
            // play the fly animation
            this.mouse.play(AnimationKeys.RocketMouseFly, true)
          } 
          else 
          {
            // turn off acceleration otherwise
            body.setAccelerationY(0)
            this.enableJetPack(false)
          }
      
          // check if touching the ground
          if (body.blocked.down) {
            // play run when touching the ground
            this.mouse.play(AnimationKeys.RocketMouseRun, true)
          }
      
          else if (body.velocity.y > 0) {
            // play fall when no longer ascending
            // PAGE 61
            this.mouse.play(AnimationKeys.RocketMouseFall, true)
          }
          break
        }
      case MouseState.Killed:
        {
          // reduce velocity to 99% of current value
          body.velocity.x *= 0.99

          // once less than 5 we can say stop
          if (body.velocity.x <= 5) {
            this.mouseState = MouseState.Dead
          }

          break
        }
      case MouseState.Dead:
        {
          // make a complete stop
          body.setVelocity(0, 0)
          // RESTART FUNCTIONALITY WILL BE CHANGED
          this.scene.scene.run(SceneKeys.GameOver)
          break
        }

    }


   
  }

 
}