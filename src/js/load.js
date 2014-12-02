
var tileSize = 64;
var dRows = 10;
var dCols = 12;

var Game = {
  w: tileSize*dCols,
  h: tileSize*dRows,
};

// var w = 800;
// var h = 600;

Game.Boot = function(game) {
  this.game = game;
};

Game.Boot.prototype = {
  preload: function() {
		this.game.stage.backgroundColor = '#FFF';
		this.game.load.image('loading', 'assets/images/loading.png');
		this.game.load.image('title', 'assets/images/title.png');
		this.game.load.image('instructions', 'assets/images/instructions.png');
    this.game.load.bitmapFont('minecraftia','assets/fonts/font.png','assets/fonts/font.xml');
  },
  create: function() {
   this.game.state.start('Load');
  }
};

Game.Load = function(game) {
  this.game = game;
};

Game.Load.prototype = {
  preload: function() {
    
    //Debug Plugin
    this.game.add.plugin(Phaser.Plugin.Debug);

    //Loading Screen Message/bar
    var loadingText = this.game.add.text(Game.w, Game.h, 'Loading...', { font: '30px Helvetica', fill: '#000' });
  	loadingText.anchor.setTo(0.5, 0.5);
  	var preloading = this.game.add.sprite(Game.w/2-64, Game.h/2+50, 'loading');
  	this.game.load.setPreloadSprite(preloading);
    this.game.load.spritesheet('rps','assets/images/RPS.png',60,60,12);
    this.game.load.spritesheet('player','assets/images/RPS_player.png',99,99,9);
    // this.game.load.spritesheet('player','assets/images/RPS_playerx.png',99,99,9);
    this.game.load.spritesheet('enemy','assets/images/RPS_enemy.png',99,99,9);
    this.game.load.spritesheet('lock', 'assets/images/RPS_lock.png',32,32,6);
    this.game.load.spritesheet('medals', 'assets/images/RPS_medals.png',30,30,12);

    this.game.load.tilemap('bridge','assets/maps/bridge.json',null,Phaser.Tilemap.TILED_JSON);
    this.game.load.spritesheet('town','assets/images/town.png',64,64,36);
    this.game.load.spritesheet('gibs','assets/images/RPS_particles.png',4,4,8);
    this.game.load.spritesheet('trophies','assets/images/RPS_trophies.png',64,64,25);
    this.game.load.image('twitter','assets/images/twitter.png');

    this.game.load.audio('hit', 'assets/audio/Hit_Hurt.wav');
    this.game.load.audio('hitPlayer', 'assets/audio/Hit_player.wav');
    this.game.load.audio('tie', 'assets/audio/Hit_tie.wav');
    this.game.load.audio('die', 'assets/audio/Hit_die.wav');
    this.game.load.audio('music', 'assets/audio/hold_the_line.ogg');

    // Music Track
    // this.game.load.audio('music','soundtrack.mp3');

  },
  create: function() {
    this.game.state.start('Menu');
  }
};
