
BasicGame.MainMenu = function (game) {

  // this.music = null;
  this.playButton = null;

};

BasicGame.MainMenu.prototype = {

  create: function () {

    //  We've already preloaded our assets, so let's kick right into the Main Menu itself.
    //  Here all we're doing is playing some music and adding a picture and button
    //  Naturally I expect you to do something significantly better :)
    
  if (BasicGame.music == null && !BasicGame.musicMuted) {
    BasicGame.music = this.add.audio('titleMusic',1,true);
    BasicGame.music.play('',0,1,true);
  } 

    this.add.sprite(0, 0, 'background');

    var title = this.add.sprite(this.game.world.width/2, 50, 'title');
    title.x = (this.game.world.width/2) - (title.getBounds().width/2);

    this.playButton = this.add.button(400, 600, 'startButton', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
    this.playButton.x = (this.game.world.width/2) - (this.playButton.getBounds().width/2)
    var instructiontext ="Tap the top half of the screen to jump. \n Tap the bottom half to duck. \n Or use your up/down arrow keys."
    var instructions = this.game.add.text(20, 200, instructiontext, { font: "32px Minecraftia", fill: "#fff", align: "center" });
    instructions.x = (this.game.world.width/2) - (instructions.getBounds().width/2) 
    
    // If the user already played
    if (BasicGame.previousscore > 0) {
        // Display its score
        this.gameOver = this.add.sprite(50, 150, 'gameOver');
        this.gameOver.reset( (this.game.world.width/2) - (this.gameOver.getBounds().width/2), (this.game.world.height/2) - (this.gameOver.getBounds().height/2))
        
        var yourScore = this.game.add.text(20, (this.game.world.height/2) + 50, BasicGame.previousscore, { font: "50px Minecraftia", fill: "#fff", align: "center" });
        yourScore.x = (this.game.world.width/2) - (yourScore.getBounds().width/2) 
    }
  },

  update: function () {

    //  Do some nice funky main menu effect here

  },

  startGame: function (pointer) {

    //  Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
    // this.music.stop();

    //  And start the actual game
    this.state.start('Game');

  }

};