'use strict';

let game = wowee({
	root: document.getElementById("game"), 
	width: "500px", 
	height: "500px",
	background: "black"
});

let s = game.createSprite();
s.graphics.fill('red');
s.graphics.draw(game.triangle(-5, 5, -5, -5, 10, -5, 10, 20, -5));