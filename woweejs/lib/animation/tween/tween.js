'use strict';

let cycle = require('../cycle'),
	easing = require('./easing'),
	geom = require('../../geom');

function update(dTime){
	
	if(dTime > this.time) {
		dTime = this.time;
	}
	
	this.elapsedTime = dTime;
	
	for(let key in this.props) {
	
		this.obj[key] = easing[this.ease](this.elapsedTime, this.props[key].start, this.props[key].delta, this.time);
		console.log(this.obj[key] * 180 / Math.PI);
	}
	if(dTime >= this.time) {
		cycle.remove(this.update);
	}

}

function Tween(obj, props, time, ease) {
	
	let key = null;
	
	this.props = {};
		
	for(key in props) {
		this.props[key] = {
			start : obj[key],
			end : props[key]
		}
		if(key.match(/rotation/)) {
			console.log(obj[key]);
			this.props[key].delta = geom.angleDifference(obj[key], props[key]);
			console.log(this.props[key].delta * 180 / Math.PI);
		} else {
			this.props[key].delta = props[key] - obj[key];	
		}
	}
	
	this.obj = obj;
	this.time = time;
	this.elapsedTime = 0;
	this.ease = ease;

	this.update = update.bind(this);

	cycle.add(this.update);
}

module.exports = Tween;