/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// // Choose Random integer in a range
function rand (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

    this.hitSnd = this.game.add.sound('hit');
    this.hitSnd.volume = 0.5;
    this.hitPlayerSnd = this.game.add.sound('hitPlayer');
    this.hitPlayerSnd.volume = 0.5;
    this.tieSnd = this.game.add.sound('tie');
    this.tieSnd.volume = 0.5;
    this.dieSnd = this.game.add.sound('die');
    this.dieSnd.volume = 0.5;

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

    this.player = this.game.add.sprite(64, 210, 'player');
    this.player.anchor.setTo(0.5, 0.5);
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
    this.player.killCount = 0;
    this.player.deathCount = 0;

    this.enemy = this.game.add.sprite(Game.w - 128, 210, 'enemy');
    this.enemy.anchor.setTo(0.5, 0.5);
    this.enemy.animations.add('idle',[0,1],3,true);
    this.enemy.choice = '';
    this.enemy.rockCount = 0;
    this.enemy.paperCount = 0;
    this.enemy.scissorsCount = 0;

    this.lock = this.game.add.sprite(0, 0, 'lock');
    this.lock.animations.add('unlock',[2,3],2);
    this.challengeText = this.game.add.bitmapText(45, 8, 'minecraftia', 'Win a game!', 20);
    this.challengeText.tint = 0xffff00;

    this.messages = this.game.add.bitmapText(Game.w/2, Game.h/2, 'minecraftia', '', 40);
    this.messages.align = 'center';
    this.messages.x = this.game.width/2 - this.messages.textWidth / 2;

    //Game win/loss/tie info
    this.winText = this.game.add.bitmapText(32, 408, 'minecraftia', '', 20);
    this.lossText = this.game.add.bitmapText(32, 440, 'minecraftia', '', 20);
    this.tieText = this.game.add.bitmapText(32, 472, 'minecraftia', '', 20);
    this.rockText = this.game.add.bitmapText(32, 504, 'minecraftia', '', 20);
    this.paperText = this.game.add.bitmapText(32, 536, 'minecraftia', '', 20);
    this.scissorsText = this.game.add.bitmapText(32, 568, 'minecraftia', '', 20);

    //Player and Enemy Health Bars
    this.playerHealthText = this.game.add.bitmapText(10, 64,'minecraftia','',20);
    this.playerHealthBar = this.game.add.sprite(100, 64, this.drawRect(260,20,'#33ff00'));
    this.playerHealthBar.alpha = 0;
    
    this.enemyHealthText = this.game.add.bitmapText(410, 64,'minecraftia','',20);
    this.enemyHealthBar = this.game.add.sprite(495, 64, this.drawRect(260,20,'#33ff00'));
    this.enemyHealthBar.alpha = 0;

    //Player Experience/Levels
    this.expBar = this.game.add.sprite(0,108,this.drawRect(Game.w,20,'#ffff00'));
    this.expBar.scale.x = 0;
    this.playerExpText = this.game.add.bitmapText(0,108,'minecraftia','',20);
    this.playerLvlText = this.game.add.bitmapText(10,36,'minecraftia','',20);


    //Player kill/death Count
    this.playerDeaths = this.game.add.sprite(550,380,'trophies',0);
    this.playerDeaths.alpha = 0;
    this.playerDeathsText = this.game.add.bitmapText(620,408,'minecraftia','',40);
    this.enemyDeaths = this.game.add.sprite(550,450,'trophies',1);
    this.enemyDeaths.alpha = 0;
    this.enemyDeathsText = this.game.add.bitmapText(620,478,'minecraftia','',40);


    //Trophies
    this.medalsTrophy = this.game.add.sprite(550,0,'trophies',2);
    this.medalsTrophy.alpha = 0.2;
    this.deathTrophy = this.game.add.sprite(620,0,'trophies',3);
    this.deathTrophy.alpha = 0.2;
    this.killTrophy = this.game.add.sprite(690,0,'trophies',4);
    this.killTrophy.alpha = 0.2;

    // default cLvl
    this.cLvl = 0;

    //Testing Level4
    // this.cLvl = 4;
    // this.player.level = 5;
    // this.enemy.level = 5;
    // this.player.health = this.player.level*100;
    // this.enemy.health = this.player.level*100;


    this.player.emitter = this.game.add.emitter(64, 180, 250);
    this.player.emitter.makeParticles('gibs',[0,1,2,3]);
    this.player.emitter.minParticleSpeed.setTo(-500, -500);
    this.player.emitter.maxParticleSpeed.setTo(500, 500);

    this.enemy.emitter = this.game.add.emitter(64, 180, 250);
    this.enemy.emitter.makeParticles('gibs',[4,5,6,7]);
    this.enemy.emitter.minParticleSpeed.setTo(-500, -500);
    this.enemy.emitter.maxParticleSpeed.setTo(500, 500);

    // var rockMedals = this.player.rockCount;
    this.rockMedals = [];
    for (var i = 0; i < 10; i++) {
      this.rockMedals[i] = this.game.add.sprite(225+(i*32),450,'medals',0);
      this.rockMedals[i].alpha = 0;
    }

    this.paperMedals = [];
    for (var j = 0; j < 10; j++) {
      this.paperMedals[j] = this.game.add.sprite(225+(j*32),490,'medals',1);
      this.paperMedals[j].alpha = 0;
    }

    this.scissorsMedals = [];
    for (var k = 0; k < 10; k++) {
      this.scissorsMedals[k] = this.game.add.sprite(225+(k*32),530,'medals',2);
      this.scissorsMedals[k].alpha = 0;
    }

    // Music
    this.music = this.game.add.sound('music');
    this.music.play('',0,0.5,true);

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
    return bmd;
  },
  actionOnClick: function(btn) {
    switch (btn.name) {
      case 'rock':
        console.log('you picked rock');
        this.player.choice = 'rock';
        break;
      case 'paper':
        console.log('you picked paper');
        this.player.choice = 'paper';
        break;
      case 'scissors':
        console.log('you picked scissors');
        this.player.choice = 'scissors';
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
    if ((this.player.winCount > 0) && (this.cLvl < 1)) {
      this.cLvl = 1;
      this.challengeText.text = 'Win 5 Times';
    }else if ((this.player.winCount > 4) && (this.cLvl < 2)) {
      this.challengeText.text = '5 Gold Medals for rock, paper OR scissors';
      this.cLvl = 2;
    }else if (((this.player.rockCount > 15) || (this.player.paperCount > 15) || (this.player.scissorsCount > 15)) && (this.cLvl < 3)){
      this.challengeText.text = 'Level 5';
      this.cLvl = 3;
    }else if ((this.player.level > 4) && (this.cLvl < 4)) {
      this.challengeText.text = '10 Kills';
      this.cLvl = 4;
    }else if (this.player.killCount > 9) {
      this.lock.alpha = 0;
      this.challengeText.text = 'You are now the Grand Master of RPS!'; 
      this.twitterButton = this.game.add.button(550, 570,'twitter', this.twitter, this);
      this.twitterButton.fixedToCamera = true;
    }

  },
  update: function() {

    this.updateChallenge();

    this.pickYourWeapon(this.player);

    //Start Showing Stats Info
    if (this.cLvl > 0) {
      this.winText.text = 'Wins: '+this.player.winCount;
      this.lossText.text = 'Losses: '+this.player.lossCount;
      this.tieText.text = 'Ties: '+this.player.tieCount;
      this.rockText.text = 'Rock #'+this.player.rockCount;
      this.paperText.text = 'Paper #'+this.player.paperCount;
      this.scissorsText.text = 'Scissors #'+this.player.scissorsCount;
    }

    //Start Showing Medals
    if (this.cLvl > 1) {
      var rockCount = this.player.rockCount;
      for (var i = 0; i < 10; i++) {
        this.rockMedals[i].alpha = 1;
        if ((rockCount - 3) > 0) {
          rockCount -= 3;
          this.rockMedals[i].frame = 9;
        }else if((rockCount - 2) > 0) {
          rockCount -= 2;
          this.rockMedals[i].frame = 6;
        }else if((rockCount - 1) > 0) {
          rockCount -= 1;
          this.rockMedals[i].frame = 3;
        }else {
          this.rockMedals[i].frame = 0;
        }
      }
      
      var paperCount = this.player.paperCount;
      for (var j = 0; j < 10; j++) {
        this.paperMedals[j].alpha = 1;
        if ((paperCount - 3) > 0) {
          paperCount -= 3;
          this.paperMedals[j].frame = 10;
        }else if((paperCount - 2) > 0) {
          paperCount -= 2;
          this.paperMedals[j].frame = 7;
        }else if((paperCount - 1) > 0) {
          paperCount -= 1;
          this.paperMedals[j].frame = 4;
        }else {

          this.paperMedals[j].frame = 1;
        }
      }

      var scissorsCount = this.player.scissorsCount;
      for (var k = 0; k < 10; k++) {
        this.scissorsMedals[k].alpha = 1;
        if ((scissorsCount - 3) > 0) {
          scissorsCount -= 3;
          this.scissorsMedals[k].frame = 11;
        }else if((scissorsCount - 2) > 0) {
          scissorsCount -= 2;
          this.scissorsMedals[k].frame = 8;
        }else if((scissorsCount - 1) > 0) {
          scissorsCount -= 1;
          this.scissorsMedals[k].frame = 5;
        }else {
          this.scissorsMedals[k].frame = 2;
        }
      }
    }

    //Start Showing XP Bar
    if (this.cLvl > 2) {
      this.expBar.scale.x = (this.player.exp/(this.player.level*100));
      this.playerExpText.text = 'EXP: '+this.player.exp +'/'+(this.player.level*100); 
      this.playerLvlText.text = 'Lvl: '+this.player.level;
    }

    //Start Showing Health Bar
    if (this.cLvl > 3) {
      this.playerHealthText.text = 'player:';
      this.enemyHealthText.text = 'enemy:';
      this.playerHealthBar.alpha = 1;
      this.enemyHealthBar.alpha = 1;

      this.playerDeaths.alpha = 1;
      this.enemyDeaths.alpha = 1;
      this.playerDeathsText.text = this.player.deathCount;
      this.enemyDeathsText.text = this.player.killCount;
    }

    //Start Showing Trophies
    if (this.player.deathCount > 9) {
      this.deathTrophy.alpha = 1;
    }
    if (this.player.killCount > 9) {
      this.killTrophy.alpha = 1;
    }
    if ((this.player.rockCount > 30) && (this.player.paperCount > 30) && (this.player.scissorsCount > 30)) {
      this.medalsTrophy.alpha = 1;
    }


    //Find out who won
    if (this.player.choice) {
      this.enemy.choice = this.choices[rand(0,2)];      
      this.pickYourWeapon(this.enemy);

      this.player.animations.stop();
      this.enemy.animations.stop();

      this.messages.fontSize = 40;
      this.messages.x = Game.w/2-64;

      if (this.player.choice === this.enemy.choice) {
        this.messages.text = 'YOU TIE!';
        this.messages.tint = 0xffffff;
        this.tieSnd.play();
        this.player.tieCount += 1;

        if (this.cLvl > 2) {
          this.player.exp += 50;
        }

      }else if (
                ((this.player.choice === 'paper') && (this.enemy.choice === 'rock')) || 
                ((this.player.choice === 'rock') && (this.enemy.choice === 'scissors')) || 
                ((this.player.choice === 'scissors') && (this.enemy.choice === 'paper'))) {

        this.messages.text = 'YOU WIN!';
        this.messages.tint = 0xffff00;
        this.player.winCount += 1;
        this.hitSnd.play();
        this.spriteHit(this.enemy);

        if (this.cLvl > 2) {
          this.player.exp += 50;
        }
        if (this.cLvl > 3) {
          this.enemy.health -= 200;
          if (this.enemy.health <= 0) {
            this.dieSnd.play();

            //Blow Up and reset Enemy
            this.enemyHealthBar.scale.x = 0;
            this.enemy.emitter.x = this.enemy.x;
            this.enemy.emitter.y = this.enemy.y;
            this.enemy.emitter.start(true, 2000, null, 500);
            this.enemy.alpha = 0;
            this.resetSprite(this.enemy);

            this.enemy.health = this.player.level * 100; //reset enemy
            this.enemyHealthBar.scale.x = 1; 
            this.player.killCount += 1;
          }else {
            this.enemyHealthBar.scale.x = this.enemy.health/(this.player.level * 100);
          }

        }
      }else {
        this.messages.text = 'YOU LOSE!';
        this.messages.tint = 0xff0000;
        this.player.lossCount += 1;
        this.hitPlayerSnd.play();
        this.spriteHit(this.player);
        
        if (this.cLvl > 3) {
          this.player.health -= 200;
          if (this.player.health <= 0) {
            this.dieSnd.play();

            //Blowup and Reset Player
            this.playerHealthBar.scale.x = 0;
            this.player.emitter.x = this.player.x;
            this.player.emitter.y = this.player.y;
            this.player.emitter.start(true, 2000, null, 500);
            this.player.alpha = 0;
            this.resetSprite(this.player);
            this.player.deathCount += 1;
            this.player.health = this.player.level * 100; //reset player
            this.playerHealthBar.scale.x = 1; 
          }else {
            this.playerHealthBar.scale.x = this.player.health/(this.player.level * 100);
          }
        }
      }
      this.enemy.choice = '';
      this.player.choice = '';
      this.delayTimer = this.game.time.now + 2000;
      if (this.cLvl > 2) {
        if (this.player.exp === (this.player.level * 100)) {
          this.player.level += 1;
          this.player.exp = 0;
          this.player.health = this.player.level * 100;
          this.enemy.health = this.player.level * 100;
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

  },
  twitter: function() {
    window.open('http://twitter.com/share?text=I+am+an+RPS+Master!+See+if+you+are+too!++at&via=rantt_&url=http://www.divideby5.com/games/RPS/', '_blank');
  },

  resetSprite: function(sprite) {
    if(this.resurrecting) {
      return;
    }
    this.resurrecting = true;
    var t = this.game.add.tween(sprite).to({alpha: 1},2000);
    t.start();
    t.onComplete.add(function() {
      this.resurrecting = false;
    },this);

  },

  spriteHit: function(sprite) {
    if(this.staggering) {
      return;
    }
    this.staggering = true;
    var t = this.game.add.tween(sprite).to({alpha: 0.3},100).to({alpha: 1},100).to({alpha: 0.3},100).to({alpha: 1},100);
    t.start();
    t.onComplete.add(function() {
      this.staggering = false;
    },this);

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
};

