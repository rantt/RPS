/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// // Choose Random integer in a range
function rand (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// var musicOn = true;


var wKey;
var aKey;
var sKey;
var dKey;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
		this.game.stage.backgroundColor = '#000';
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);

    this.actionbar = this.game.add.group();
    this.rock = this.game.add.button(Game.w/2-64,Game.h-150,'rps',this.actionOnClick, this, 3,0,6,3);
    this.rock.name = 'rock';

    this.paper = this.game.add.button(Game.w/2,Game.h-150,'rps',this.actionOnClick, this, 4,1,7,4);
    this.paper.name = 'paper';

    this.scissors = this.game.add.button(Game.w/2+64,Game.h-150,'rps',this.actionOnClick, this, 5,2,8,5);
    this.scissors.name = 'scissors';

    this.choices = ['rock', 'paper', 'scissors'];
    this.playerChoice = '';
    this.computerChoice = '';

    // // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);

    //Setup WASD and extra keys
    wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);

  },
  actionOnClick: function(btn) {
    switch (btn.name) {
      case 'rock':
        console.log('you picked rock');
        this.playerChoice = 'rock';
        break;
      case 'paper':
        console.log('you picked paper');
        this.playerChoice = 'paper';
        break;
      case 'scissors':
        console.log('you picked scissors');
        this.playerChoice = 'scissors';
        break;
    }

  },

  update: function() {
    if (this.computerChoice === '') {
      this.computerChoice = this.choices[rand(0,2)];      
    }

    if (this.computerChoice && this.playerChoice) {
      if (this.playerChoice === this.computerChoice) {
        console.log("YOU TIE!");
      }else if (
                ((this.playerChoice === 'paper') && (this.computerChoice === 'rock')) || 
                ((this.playerChoice === 'rock') && (this.computerChoice === 'scissors')) || 
                ((this.playerChoice === 'scissors') && (this.computerChoice === 'paper'))) {
        console.log("YOU WIN! "+this.playerChoice+' beats '+this.computerChoice);
      }else {
        console.log("YOU LOSE!"+this.computerChoice+' beats '+this.playerChoice);
      }

      this.computerChoice = '';
      this.playerChoice = '';
    }
   

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  // toggleMute: function() {
  //   if (musicOn == true) {
  //     musicOn = false;
  //     this.music.volume = 0;
  //   }else {
  //     musicOn = true;
  //     this.music.volume = 0.5;
  //   }
  // },
  // render: function() {
  //   game.debug.text('Health: ' + tri.health, 32, 96);
  // }

};

