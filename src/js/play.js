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


    //Map
    this.map = this.game.add.tilemap('bridge');
    this.map.addTilesetImage('town');
    this.layer1 = this.map.createLayer('layer1');
    this.layer1.resizeWorld();

    //Buttons
    buttonHeight = Game.h/2+64;
    this.rock = this.game.add.button(Game.w/2-64,buttonHeight,'rps',this.actionOnClick, this, 3,0,6,3);
    this.rock.name = 'rock';

    this.paper = this.game.add.button(Game.w/2,buttonHeight,'rps',this.actionOnClick, this, 4,1,7,4);
    this.paper.name = 'paper';

    this.scissors = this.game.add.button(Game.w/2+64,buttonHeight,'rps',this.actionOnClick, this, 5,2,8,5);
    this.scissors.name = 'scissors';

    this.choices = ['rock', 'paper', 'scissors'];

    this.player = this.game.add.sprite(64, 180, 'player');
    this.player.animations.add('idle',[0,1],3,true);
    this.player.choice = '';
    this.player.winCount = 0;
    this.player.lossCount = 0;
    this.player.tieCount = 0;

    this.enemy = this.game.add.sprite(Game.w - 128, 180, 'enemy');
    this.enemy.animations.add('idle',[0,1],3,true);
    this.enemy.choice = '';

    this.lock = this.game.add.sprite(32, 64, 'lock');
    this.lock.animations.add('unlock',[2,3],2);
    this.challengeText = this.game.add.bitmapText(85, 74, 'minecraftia', 'Win 3 in a row', 20);

    this.messages = this.game.add.bitmapText(Game.w/2, Game.h/2, 'minecraftia', '', 40);
    this.messages.align = 'center';
    this.messages.x = this.game.width/2 - this.messages.textWidth / 2;

    this.winText = this.game.add.bitmapText(32, 428, 'minecraftia', '', 20);
    this.lossText = this.game.add.bitmapText(32, 460, 'minecraftia', '', 20);
    this.tieText = this.game.add.bitmapText(32, 492, 'minecraftia', '', 20);

    this.cLvl = 0;

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
        this.player.choice = 'rock'
        // this.playerChoice = 'rock';
        break;
      case 'paper':
        console.log('you picked paper');
        this.player.choice = 'paper';
        // this.playerChoice = 'paper';
        break;
      case 'scissors':
        console.log('you picked scissors');
        this.player.choice = 'scissors';
        // this.playerChoice = 'scissors';
        break;
    }

  },
  pickYourWeapon: function(combatant) {
     switch(combatant.choice) {
      case 'rock':
        combatant.frame = 2;
        break;
      case 'paper':
        combatant.frame = 3;
        break;
      case 'scissors':
        combatant.frame = 4;
        break;
    }
   
  },
  updateChallenge: function() {
    // if (this.lock.alive === false) {
    //   this.lock.reset(34,64);
    //   this.lock.frame = 0;
    // }
    if (this.player.winCount === 3) {
      this.cLvl = 1;
      this.challengeText.text = 'Win 10 Times';
      // this.lock.animations.play('unlock',2,false, true);

    }else if (this.player.winCount === 10) {
      this.challengeText.text = 'I don\'t know';
      this.cLvl = 2;
    }
  },
  update: function() {

    this.updateChallenge();

    this.pickYourWeapon(this.player);

    if (this.cLvl > 0) {
      this.winText.text = 'Wins: '+this.player.winCount;
      this.lossText.text = 'Losses: '+this.player.lossCount;
      this.tieText.text = 'Ties: '+this.player.tieCount;
    }



    if (this.player.choice) {
      this.enemy.choice = this.choices[rand(0,2)];      
      this.pickYourWeapon(this.enemy);

      this.messages.fontSize = 40;
      this.messages.x = Game.w/2-64;

      if (this.player.choice === this.enemy.choice) {
        this.messages.text = "YOU TIE!";
        console.log("YOU TIE!");
        this.player.tieCount += 1;
      }else if (
                ((this.player.choice === 'paper') && (this.enemy.choice === 'rock')) || 
                ((this.player.choice === 'rock') && (this.enemy.choice === 'scissors')) || 
                ((this.player.choice === 'scissors') && (this.enemy.choice === 'paper'))) {
        this.messages.text = "YOU WIN!";
        console.log("YOU WIN! "+this.player.choice+' beats '+this.enemy.choice);
        this.player.winCount += 1;
      }else {
        this.messages.text = "YOU LOSE!";
        console.log("YOU LOSE!"+this.enemy.choice+' beats '+this.player.choice);
        this.player.lossCount += 1;
      }
      this.enemy.choice = '';
      this.player.choice = '';
    }

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  getReady: function() {
    if (this.ready == false) {
      return;
    }
    this.ready = false;
    this.messages.text = 'Choose!';

    this.game.time.events.add(Phaser.Timer.SECOND,function() {
      this.tweenNumber();
    }, this);

  },
  tweenNumber: function() {
    if (this.tweening) {
      return;
    }
    this.tweening = true;
    this.messages.text = this.countDownInt;
    var t = this.game.add.tween(this.messages).to({fontSize: 0},1000);
    t.start();
    t.onComplete.add(function() {
      this.messages.fontSize = 80;
      this.tweening = false;
      if (this.countDownInt > 1) {
        this.countDownInt -= 1;
        this.tweenNumber();
      }else{
        this.countDownInt = 3;
        this.messages.text = '';
      }
    },this);
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

