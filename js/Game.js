
BasicGame.Game = function (game) {

  //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;    //  a reference to the currently running game
    this.add;    //  used to add sprites, text, groups, etc
    this.camera;  //  a reference to the game camera
    this.cache;    //  the game cache
    this.input;    //  the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;    //  for preloading assets
    this.math;    //  lots of useful common math operations
    this.sound;    //  the sound manager - add a sound, play one, set-up markers, etc
    this.stage;    //  the game stage
    this.time;    //  the clock
    this.tweens;  //  the tween manager
    this.world;    //  the game world
    this.particles;  //  the particle manager
    this.physics;  //  the physics manager
    this.rnd;    //  the repeatable random number generator

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    this.ground        = null;
    this.player        = null;
    this.isHit         = false;
    this.blocks        = null;
    this.count         = 0;
    this.blockspeed    = 400;
    this.blockspeedmod = 50;
    this.countmod      = 1;
    this.countexp      = 0.8;

};

BasicGame.Game.prototype = {

  create: function () {
    //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
    // Background
    this.add.sprite(0, 0, 'background');
    // sky.width = w;
    
    var title = this.add.sprite(this.game.world.width/2, 50, 'title');
    title.x = (this.game.world.width/2) - (title.getBounds().width/2);
    // 
    scoreText = this.game.add.text(600, 120, 'Score: 0', { font: "30px Arial", fill: "#fff", align: "left" });
    highScoreText = this.game.add.text(300, 125, 'Best: ' + BasicGame.highscore , { font: "20px Arial", fill: "#fff", align: "left" });
    
    // //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    // 
    // Create the ground platform and give it gravity
    this.ground = this.add.sprite(48, this.game.world.height - 64, 'ground');
    this.game.physics.arcade.enable(this.ground);
    this.ground.width = 300;
    this.ground.x = (this.game.world.width/2) - 150;
    this.ground.body.immovable = true;

    // // The this.player and its settings
    this.player = this.add.sprite(this.game.world.width/2, this.game.world.height - 150, 'duck');
    this.game.physics.arcade.enable(this.player);
    this.player.body.bounce.y = 0.25;
    this.player.body.gravity.y = 1500;
    // this.player.body.collideWorldBounds = false;
    this.player.checkWorldBounds = true;
    this.player.events.onOutOfBounds.add( this.killPlayer, this );
    // 
    // 
    // //  Our controls.
    cursors = this.input.keyboard.createCursorKeys();
    
    BasicGame.currentscore = 0;
    this.count = 0;
    
    this.addBlock();
  },

  update: function () {

    //  Collide the this.player and the stars with the platforms
    this.physics.arcade.collide(this.player, this.ground);

    if (!this.isHit) {
      this.physics.arcade.collide(this.player, this.blocks, this.hitBlock, null, this);
    }
    
    BasicGame.currentscore += 1;
    scoreText.text = 'Score: ' + BasicGame.currentscore;
    
    // this.blocks.body.velocity.x = - 1500;
    this.blocks.body.velocity.x = -(this.blockspeed + (this.blockspeedmod * Math.pow(this.count*this.countmod, this.countexp)))

    //  Reset the this.players velocity (movement)
    this.player.body.velocity.x = 0;
    
    //  Allow the this.player to jump if they are touching the ground. 
    if ( ( cursors.up.isDown || ( this.game.input.activePointer.isDown && this.game.input.activePointer.positionDown.y < this.game.world.height/2) ) && this.player.body.touching.down)
    {
        // this.player.body.velocity.y = -500;
        // this.playerJump()
        this.player.body.velocity.y = -500;
    }
    
    //  Allow the this.player to duck
    if ( ( cursors.down.isDown || ( this.game.input.activePointer.isDown && this.game.input.activePointer.positionDown.y > this.game.world.height/2) ) && this.player.body.touching.down)
    {
      // this.playerDuck();
      if (this.player.scale.y == 0.5) {
        // already crouched 
      }else{
        this.player.y += this.player.getBounds().height/2;
        this.player.scale.y = 0.5;
      }
    }else{
      if (this.player.scale.y == 1) {
        // already standing
      }else{
        this.player.y -= this.player.getBounds().height;
        this.player.scale.y = 1;
      }      
    } 

  },
  
  killPlayer: function ()  {
    this.player.reset(this.game.world.width/2, this.game.world.height - 150);
    BasicGame.previousscore = BasicGame.currentscore;
    if (BasicGame.currentscore > BasicGame.highscore) {
      BasicGame.highscore = BasicGame.currentscore;
      BasicGame.currentscore = 0;
    }

      this.state.start('MainMenu');
  },

  addBlock: function (){
    // blocks
    this.blocks = this.add.sprite(200, this.game.world.height - (Math.random() > 0.5 ? 150 : 114) , 'block')
    this.game.physics.arcade.enable(this.blocks);
    this.blocks.body.immovable = true;  
    this.blocks.checkWorldBounds = true;
    this.blocks.events.onOutOfBounds.add( this.killBlock, this );
  },

  killBlock: function (block) {
    block.reset(this.game.world.width - block.getBounds().width , this.game.world.height - (Math.random() > 0.5 ? 150 : 114));
    this.count += 1;
  },

  hitBlock: function (player) {
    this.isHit = true;
    var v = {x: this.player.body.velocity.x, y:  this.player.body.velocity.y};
    this.player.reset(player.x -  this.player.getBounds().width,  this.player.y);
    this.player.alpha = 0.2;
    this.player.body.velocity.set(v.x, v.y);
    var t = this;
    setTimeout(function(){
      t.isHit = false; 
      t.player.alpha = 1;
    }, 500);

  },

  quitGame: function (pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
    this.player.destroy();
    this.blocks.destroy();
    this.ground.destroy();
    //  Then let's go back to the main menu.
    this.state.start('MainMenu');

  }

};