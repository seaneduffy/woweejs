'use strict';

let game = wowee({
	root: document.getElementById("game"), 
	width: "500px", 
	height: "500px",
	background: "black"
});

let s = game.createSprite();
game.addToViewport(s);
s.graphics.fillStyle = 'red';
s.graphics.drawRect(0,0,100,100);

function moveToRight() {
	s.x = s.x+.1;
	requestAnimationFrame(moveToRight);
}

s.x = 20;

requestAnimationFrame(moveToRight);