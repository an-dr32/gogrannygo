var game = new Phaser.Game(600, 700, Phaser.AUTO, 'gameDiv');

var first=true;
var speedFactor=300;
var invulnerability=0;
var dificultad = 1;

var shakeWorld = 0;
var shakeWorldMax = 20;
var shakeWorldTime = 0;
var shakeWorldTimeMax = 40;

var score = 0;

var lives;

settings = {
    shakesCount: 0,
    shakeX: true,
    shakeY: true,
    sensCoef: 0.5
  };

var mainState = {

    preload: function() { 
        game.stage.backgroundColor = '#71c5cf';

        game.load.image('bird', 'assets/Carro.png'); 
        game.load.image('lifes', 'assets/lifes.png'); 

        game.load.image('goodGuy', 'assets/BluePills.png'); 
        game.load.image('goodGuy2', 'assets/RedPills.png');
        game.load.image('badGuy', 'assets/Agujero.png');  
        game.load.image('bus', 'assets/Bus.png'); 
//Explosion spritesheet
        game.load.spritesheet('kaboom', 'assets/explode2.png', 500,500,10);
        game.load.spritesheet('patinada', 'assets/patinada.png', 100,100,10);
        //bg
        game.load.image('background', 'assets/Calle.jpg');
        game.load.image('acera', 'assets/acera.png');

        //SOUNDS
        game.load.audio('hit', 'assets/Changing wheels in boxes.wav');
        game.load.audio('item', 'assets/Oil Change.wav');  
        game.load.audio('brakes', 'assets/Jump.wav');  
        game.load.audio('bgSound', 'assets/ZZ Top - La Grange 8-bit.mp3');  
        //Explosion sound
        game.load.audio('explotar', 'assets/explode.wav');      
    },

    create: function() { 
        game.physics.startSystem(Phaser.Physics.ARCADE);


        //  The scrolling starfield background
        this.acera = game.add.tileSprite(0, 0, 600, 700, 'acera')
        this.background = game.add.tileSprite(113.5, 0, 373, 700, 'background');


        this.bird = this.game.add.sprite(300, 625, 'bird');
        game.physics.enable(this.bird, Phaser.Physics.ARCADE);


        this.bird.body.collideWorldBounds = true;
        this.bird.body.bounce.set(0.5);
        this.bird.body.allowRotation = true;
        this.bird.body.immovable = true;
        
        //los buenos
        this.goodGuys = game.add.group();
        this.goodGuys.enableBody = true;
        this.goodGuys.createMultiple(20, 'goodGuy');

        this.goodGuys2 = game.add.group();
        this.goodGuys2.enableBody = true;
        this.goodGuys2.createMultiple(20, 'goodGuy2');

        //los malos
        this.badGuys = game.add.group();
        this.badGuys.enableBody = true;
        this.badGuys.createMultiple(20, 'badGuy');

        this.bus = game.add.group();
        this.bus.enableBody = true;
        this.bus.createMultiple(20, 'bus');



        //Tira elementos  
        this.timer = this.game.time.events.loop(400, this.addGuys, this);

        // para reducir la velocidad
        this.timer = this.game.time.events.loop(1000, this.removeSpeed, this);



        game.physics.arcade.enable(this.bird);
        //this.bird.body.gravity.y = 1000; 

        // New anchor position
        this.bird.anchor.setTo(0.5, 0.5); 
 
        var left = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        var right = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        var restartButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        left.onDown.add(this.moveL, this); 
        left.onUp.add(this.hammerTime, this); 
        right.onDown.add(this.moveR, this); 
        right.onUp.add(this.hammerTime, this);
        restartButton.onDown.add(this.restartGame, this); 

        speedFactor = 300;
        this.score = 0;
        this.labelScore = this.game.add.text(20, 20, "0", { font: "30px return_of_ganonregular", fill: "#ffffff" }); 

        score = 0;
        this.scores = 0;
        this.labelScores = this.game.add.text(280, 20, "0", { font: "30px return_of_ganonregular", fill: "#ffffff" }); 

        lifes = game.add.group();
        game.add.text(game.world.width - 100, 20, 'Lifes : ', { font: '30px return_of_ganonregular', fill: '#fff' }); 
        //  Text
        stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '38px return_of_ganonregular', fill: '#fff' });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = false;

    for (var i = 0; i < 3; i++) 
    {
        var Lifes = lifes.create(game.world.width - 85 + (30 * i), 60, 'lifes');
        Lifes.anchor.setTo(0.5, 0.5);
        Lifes.angle = 0;
        Lifes.alpha = 0.8;
    }


        //Creates In-game sound
        this.explosionSound = game.add.audio('explotar');  
        this.hitSound = this.game.add.audio('hit');
        this.hitSound.volume = 0.5;
        this.itemSound = this.game.add.audio('item');
        this.itemSound.volume = 0.4; 
        this.bgSound = this.game.add.audio('bgSound');
        this.brakesSound = this.game.add.audio('brakes');
        this.brakesSound.volume = 0.8;
        //  Being mp3 files these take time to decode, so we can't play them instantly
        //  Using setDecodedCallback we can be notified when they're ALL ready for use.
        //  The audio files could decode in ANY order, we can never be sure which it'll be.

        //game.sound.setDecodedCallback([ this.bgSound ], start, this);
        this.bgSound.onStop.add(this.playBgSound, this);
        
        dificultad =0;

        restartButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    update: function() {
      if (this.bird.inWorld == false)
            //this.restartGame(); 

        if (this.bird.alive == false)
            //this.restartGame();

        if (this.bird.alive){
        }
        
        dificultad +0.5;

        if(invulnerability>0)
          invulnerability--;
          
        this.moveCamera();
          //  Scroll the background
          this.background.tilePosition.y += 10;
          this.acera.tilePosition.y += 10;

          if(first){
            this.bgSound.play();
            //this.jumpSound.onStop.add(this.playBgSound, this);
            first=false;    
          }
          //hit a good guy
          game.physics.arcade.overlap(this.bird, this.goodGuys, this.hitGood, null, this);
          game.physics.arcade.overlap(this.bird, this.goodGuys2, this.hitGood, null, this);
          game.physics.arcade.overlap(this.bird, this.badGuys, this.hitBad, null, this);
          game.physics.arcade.overlap(this.bird, this.bus, this.hitBad, null, this);

          game.physics.arcade.overlap(this.bird, this.acera, this.slowIt, null, this);
        


          this.labelScore.text = "Speed:"+ speedFactor;
          this.labelScores.text = "Score:"+ score;


          // game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);  
          if (this.bird.body.position.x<113.5){
            this.bird.body.velocity.x = 15;  
          }
           if (this.bird.body.position.x>410){
            console.log("entr2");
            this.bird.body.velocity.x = -15;  
          }

          if (shakeWorld > 0) {
          var rand1 = game.rnd.integerInRange(-20,20);
          var rand2 = game.rnd.integerInRange(-20,20);
          game.world.setBounds(rand1, rand2, game.width + rand1, game.height + rand2);
          shakeWorld--;
          if (shakeWorld == 0) {
          game.world.setBounds(0, 0, game.width,game.height); // normalize after shake?
    }
}


    },
    removeSpeed: function(){
      if(speedFactor>0)
        speedFactor-=10;
    },
    moveR: function() {
        // If the bird is dead, he can't jump
        if (this.bird.alive == false)
            return; 

        //Activates In-Game Sound
        this.brakesSound.play(); 
        
        this.bird.body.velocity.x = 150+speedFactor;
        game.add.tween(this.bird).to({angle: 20}, 100).start();
        this.labelScore.text = "Speed:"+ speedFactor; 
        
        

    },

    moveL: function() {
        // If the bird is dead, he can't jump
        if (this.bird.alive == false)
            return; 

        this.brakesSound.play(); 
        this.bird.body.velocity.x = -150-speedFactor;
        game.add.tween(this.bird).to({angle: -20}, 100).start();
        this.labelScore.text = "Speed:"+ speedFactor;


    },

    hammerTime: function() {
        this.bird.body.velocity.x = 0;
        game.add.tween(this.bird).to({angle: 0}, 100).start();
        this.labelScore.text = "Speed:"+ speedFactor;


    },

    hitGood: function(){
      /* Version Caro */
      speedFactor = speedFactor + 50;

      if(speedFactor=300)
        hitGood=false;

    
      this.goodGuys.forEachAlive(function(p){
            p.body.position.y = 710;
        }, this);

      this.itemSound.play();
      if (this.bird.alive == false)
        this.itemSound.stop(); 

      score = score + 20;
      this.labelScores.text = "Score:"+ score;




    },

    hitGood2: function(){
      /* Version Caro */
      speedFactor = speedFactor + 50;
      this.goodGuys2.forEachAlive(function(p){
            p.body.position.y = 710;
        }, this);
    },

    hitBad: function(){
      if (this.bird.alive == false || invulnerability >0)
        return;

      if (this.bird.alive == false)
        hitGood=30; 


      

      life = lifes.getFirstAlive();
      settings.shakesCount = 10;
      if (life){
        life.kill();
      }
      invulnerability = 100;
      this.hitSound.play(); 

      if(right=true){
          //añado a los malos
          game.add.tween(this.bird).to({angle: 360}, 500).start();
        }

        if(left=true){
          //añado a los buenos
        game.add.tween(this.bird).to({angle: -360}, 500).start();
        }
      

        
      if (lifes.countLiving() < 1){
        this.bird.alive = false;
        this.game.time.events.remove(this.timer);  
        this.bird.alpha=0;
        this.badGuys.alpha=0;
        this.goodGuys.alpha=0;
        this.labelScore.text = "Speed:"+ speedFactor;
        this.labelScores.text = "Score:"+ score;




        var kaboom = game.add.sprite(this.bird.body.position.x-240, this.bird.body.position.y-225, 'kaboom');
        kaboom.animations.add('explosion');
        kaboom.animations.play('explosion', 9, false , true)

        //Activates explosion Sound
          this.explosionSound.play(); 
          this.hitSound.stop(); 
          this.itemSound.stop();



        //  Stop scrolling the background
          this.background.tilePosition.y = 0;
          this.acera.tilePosition.y = 0;

        // Go through all the pipes, and stop their movement
        this.goodGuys.forEachAlive(function(p){
        p.body.velocity.y = 0;
        }, this);
        this.goodGuys2.forEachAlive(function(p){
          p.body.velocity.y = 0;
        }, this);
        this.badGuys.forEachAlive(function(p){
          p.body.velocity.y = 0;
        }, this);


         

        stateText.text="GAME OVER \n \nPress SPACEBAR to restart \n \n" +this.labelScores.text;
        stateText.visible = true;


        //the "click to restart" handler
        //game.input.onTap.addOnce(this.restartGame,this);
      }
    },

    //slowDown: function() {

    //}

    
    playBgSound: function(){
        this.bgSound.play();
    },

    
    addOneGuy: function(x, y,good) {
        var guy;
        if(good){
          guy = this.goodGuys.getFirstDead();

        
        }else{
          guy = this.badGuys.getFirstDead();
        }
        guy.reset(x, y);
        guy.body.velocity.y = 605+dificultad;  
        guy.checkWorldBounds = true;
        guy.outOfBoundsKill = true;
    },
    addGuys: function() {
        var hole = Math.floor(Math.random()*40)+1;
        
        if(hole>4){
          //añado a los malos
          this.addOneGuy(Math.floor((Math.random()*300)+140), 1,false);
        }else{
          //añado a los buenos
          this.addOneGuy(Math.floor((Math.random()*300)+140), 1,true);
        }
 
    },

    restartGame: function() {

      //  A new level starts
    /*
      //resets the life count
      lifes.callAll('revive');
      //  And brings the aliens back from the dead :)
      this.badGuys.removeAll();
      this.goodGuys.removeAll();
      addGuys();

      revives the player
      this.bird.revive();
      */
      game.state.start('main');

    },
    moveCamera: function(){
    if(settings.shakesCount > 0){
      var sens = settings.shakesCount * settings.sensCoef;

      if(settings.shakesCount % 2){
        this.game.camera.x += settings.shakeX ? sens : 0;
        this.game.camera.y += settings.shakeY ? sens : 0;
      }
      else{
        this.game.camera.x -= settings.shakeX ? sens : 0;
        this.game.camera.y -= settings.shakeY ? sens : 0;
      }

      settings.shakesCount--;

      if(settings.shakesCount === 0){
        this.game.camera.setPosition(0, 0);
      }
    }
  },

};

game.state.add('main', mainState);  
game.state.start('main'); 

//https://phaser.io/examples/v2/games/invaders