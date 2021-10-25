window.onload = function() {

    var game = new Phaser.Game(800, 400, Phaser.AUTO, '', { preload: preload, create: create });

    var explode;

    function preload () {
        game.load.atlasJSONHash('assets', 'assets.png', 'assets.json');
    }

    function create () {
    	var background = game.add.sprite(0, 0, 'assets', 'background');

    	// create capguy sprite
	    explode = game.add.sprite(0, 0, 'assets', 'explode1');

	    // scale it down a bit
	    explode.scale.setTo(1,1);

	    // add animation phases
	    explode.animations.add('explode', [
	        'explode1',
	        'explode2',
	        'explode3',
	        'explode4',
	        'explode5',
	        'explode6',
	        'explode7',
	        'explode8',
	        'explode9',

	    ], 10, true, false);

	    // play animation
	    explode.animations.play('explode');
}


    }
};