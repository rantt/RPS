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
		this.game.stage.backgroundColor = '#FFF';
    this.game.world.setBounds(0, 0 ,Game.w, Game.h);

    //Map
    this.map = this.game.add.tilemap('bridge');
    this.map.addTilesetImage('town');
    this.layer1 = this.map.createLayer('layer1');
    this.layer1.resizeWorld();


    //Buttons
    var buttonHeight = Game.h/2+64;
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
    this.player.rockCount = 0;
    this.player.paperCount = 0;
    this.player.scissorsCount = 0;
    this.player.level = 1;
    this.player.exp = 0;

    this.enemy = this.game.add.sprite(Game.w - 128, 180, 'enemy');
    this.enemy.animations.add('idle',[0,1],3,true);
    this.enemy.choice = '';
    this.enemy.rockCount = 0;
    this.enemy.paperCount = 0;
    this.enemy.scissorsCount = 0;

    this.lock = this.game.add.sprite(0, 0, 'lock');
    this.lock.animations.add('unlock',[2,3],2);
    this.challengeText = this.game.add.bitmapText(45, 8, 'minecraftia', 'Win 3 Times!', 20);

    this.messages = this.game.add.bitmapText(Game.w/2, Game.h/2, 'minecraftia', '', 40);
    this.messages.align = 'center';
    this.messages.x = this.game.width/2 - this.messages.textWidth / 2;

    this.winText = this.game.add.bitmapText(32, 408, 'minecraftia', '', 20);
    this.lossText = this.game.add.bitmapText(32, 440, 'minecraftia', '', 20);
    this.tieText = this.game.add.bitmapText(32, 472, 'minecraftia', '', 20);
    this.rockText = this.game.add.bitmapText(32, 504, 'minecraftia', '', 20);
    this.paperText = this.game.add.bitmapText(32, 536, 'minecraftia', '', 20);
    this.scissorsText = this.game.add.bitmapText(32, 568, 'minecraftia', '', 20);

    this.cLvl = 0;

    this.playerHealthText = this.game.add.bitmapText(10, 64,'minecraftia','',20);
    // this.playerHealthText = this.game.add.bitmapText(10, 64,'minecraftia','life:',20);
    this.playerHealthBar = this.game.add.sprite(64, 64, this.drawRect(260,20,'#33ff00'));
    this.playerHealthBar.scale.x = 0;

    this.enemyHealthText = this.game.add.bitmapText(420, 64,'minecraftia','',20);
    // this.enemyHealthText = this.game.add.bitmapText(420, 64,'minecraftia','life:',20);
    this.enemyHealthBar = this.game.add.sprite(470, 64, this.drawRect(260,20,'#33ff00'));
    this.enemyHealthBar.scale.x = 0;

    this.expBar = this.game.add.sprite(0,108,this.drawRect(Game.w,20,'#ffff00'));
    this.expBar.scale.x = 0;
    this.playerExpText = this.game.add.bitmapText(0,108,'minecraftia','',20);
    // this.playerExpText.text = "EXP: "+this.player.exp +"/"+(this.player.level*100); 

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
  drawRect: function(width, height,color) {
    var bmd = this.game.add.bitmapData(width, height);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fillStyle = color;
    bmd.ctx.fill();
    // bmd.ctx.save();
    // bmd.ctx.restore();
    // bmd.ctx.closePath();
    return bmd;
  },
  actionOnClick: function(btn) {
    switch (btn.name) {
      case 'rock':
        console.log('you picked rock');
        this.player.choice = 'rock';
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
        combatant.rockCount += 1;
        break;
      case 'paper':
        combatant.frame = 3;
        combatant.paperCount += 1;
        break;
      case 'scissors':
        combatant.frame = 4;
        combatant.scissorsCount += 1;
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
      this.challengeText.text = 'All Gold Medals for rock, paper OR scissors';
      this.cLvl = 2;
    }else if (((this.player.rockCount >= 30) || (this.player.paperCount >= 30) || (this.player.scissorsCount >= 30)) && (this.cLvl < 3)){
      this.challengeText.text = 'Level 2';
      this.cLvl = 3;
    }else if (this.player.level === 2) {
      this.challengeText.text = '10 Kills';
      this.cLvl = 4;
    }

  },
  update: function() {

    this.updateChallenge();

    this.pickYourWeapon(this.player);
    console.log('lvl',this.player.level);

    if (this.cLvl > 0) {
      this.winText.text = 'Wins: '+this.player.winCount;
      this.lossText.text = 'Losses: '+this.player.lossCount;
      this.tieText.text = 'Ties: '+this.player.tieCount;
      this.rockText.text = 'Rock #'+this.player.rockCount;
      this.paperText.text = 'Paper #'+this.player.paperCount;
      this.scissorsText.text = 'Scissors #'+this.player.scissorsCount;
    }
    if (this.cLvl > 1) {
      var rockMedals = this.player.rockCount;
      for (var i = 0; i < 10; i++) {
        if ((rockMedals - 3) > 0) {
          rockMedals -= 3;
          this.game.add.sprite(325+(i*32),450,'medals',9);
        }else if((rockMedals - 2) > 0) {
          rockMedals -= 2;
          this.game.add.sprite(325+(i*32),450,'medals',6);
        }else if((rockMedals - 1) > 0) {
          rockMedals -= 1;
          this.game.add.sprite(325+(i*32),450,'medals',3);
        }else {
          this.game.add.sprite(325+(i*32),450,'medals',0);
        }
      }

      var paperMedals = this.player.paperCount;
      for (var j = 0; j < 10; j++) {
        if ((paperMedals - 3) > 0) {
          paperMedals -= 3;
          this.game.add.sprite(325+(j*32),490,'medals',10);
        }else if((paperMedals - 2) > 0) {
          paperMedals -= 2;
          this.game.add.sprite(325+(j*32),490,'medals',7);
        }else if((paperMedals - 1) > 0) {
          paperMedals -= 1;
          this.game.add.sprite(325+(j*32),490,'medals',4);
        }else {
          this.game.add.sprite(325+(j*32),490,'medals',1);
        }
      }

      var scissorsMedals = this.player.scissorsCount;
      for (var k = 0; k < 10; k++) {
        if ((scissorsMedals - 3) > 0) {
          scissorsMedals -= 3;
          this.game.add.sprite(325+(k*32),530,'medals',11);
        }else if((scissorsMedals - 2) > 0) {
          scissorsMedals -= 2;
          this.game.add.sprite(325+(k*32),530,'medals',8);
        }else if((scissorsMedals - 1) > 0) {
          scissorsMedals -= 1;
          this.game.add.sprite(325+(k*32),530,'medals',5);
        }else {
          this.game.add.sprite(325+(k*32),530,'medals',2);
        }
      }
    }

    if (this.cLvl > 2) {
      this.expBar.scale.x = (this.player.exp/(this.player.level*100));
      this.playerExpText.text = "EXP: "+this.player.exp +"/"+(this.player.level*100); 
    }

    if (this.cLvl > 3) {
      this.playerHealthText.text = 'life:';
      this.enemyHealthText.text = 'life:';
      this.playerHealthBar.scale.x = 1;
      this.enemyHealthBar.scale.x = 1;
    }

    if (this.player.choice) {
      this.enemy.choice = this.choices[rand(0,2)];      
      this.pickYourWeapon(this.enemy);

      this.player.animations.stop();
      this.enemy.animations.stop();

      this.messages.fontSize = 40;
      this.messages.x = Game.w/2-64;

      if (this.player.choice === this.enemy.choice) {
        this.messages.text = 'YOU TIE!';
        this.player.tieCount += 1;
        if (this.cLvl > 2) {
          this.player.exp += 50;
        }

      }else if (
                ((this.player.choice === 'paper') && (this.enemy.choice === 'rock')) || 
                ((this.player.choice === 'rock') && (this.enemy.choice === 'scissors')) || 
                ((this.player.choice === 'scissors') && (this.enemy.choice === 'paper'))) {
        this.messages.text = 'YOU WIN!';
        this.player.winCount += 1;
        if (this.cLvl > 2) {
          this.player.exp += 50;
        }
      }else {
        this.messages.text = 'YOU LOSE!';
        this.player.lossCount += 1;
      }
      this.enemy.choice = '';
      this.player.choice = '';
      this.delayTimer = this.game.time.now + 2000;
      if (this.cLvl > 2) {
        if (this.player.exp === (this.player.level * 100)) {
          this.player.level += 1;
          this.player.exp = 0;
        }
      }

    }else {
      if ((this.delayTimer - this.game.time.now) > 0) {
        this.player.animations.stop();
        this.enemy.animations.stop();
      }else {
        this.player.animations.play('idle');
        this.enemy.animations.play('idle');
      }
    }

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  getReady: function() {
    if (this.ready === false) {
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

