/*global Game*/

Game.Menu = function(game){
  this.game = game;
};

Game.Menu.prototype =  {
    create: function() {

        this.title = this.game.add.sprite(Game.w/2,Game.h/2-100,'title');
        this.title.anchor.setTo(0.5,0.5);

        // Start Message
        var text = this.game.add.text(Game.w/2, Game.h/2+100, '~click to start~', { font: '30px Helvetica', fill: '#FFF' });
        text.anchor.setTo(0.5, 0.5);

    },
    update: function() {
      //Click to Start
      if (this.game.input.activePointer.isDown){
        this.game.state.start('Play');
      }
    }
};
