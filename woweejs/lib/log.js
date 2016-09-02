'use strict';

let root = null;

let log = {
	log: function(title, text){

		if(root == null) {
			root = document.createElement('div');
			root.style.position = 'absolute';
			root.style.width = '300px';
			root.style.right = '10px';
			root.style.bottom = '10px';
			root.style.fontFamily = 'Arial';
			root.style.fontSize = '12px';
			root.style.color = 'white';
			document.body.appendChild(root);
		}

		let id = 'log-'+title.toLowerCase().replace(' ', '_'),
			el = document.getElementById(id),
			titleEl = null,
			textEl = null;
		if(el == null) {
			el = document.createElement('div');
			el.setAttribute('id', id);
			titleEl = document.createElement('span');
			titleEl.style.display = 'inline-block';
			titleEl.style.fontWeight = 'bold';
			el.appendChild(titleEl);
			textEl = document.createElement('span');
			textEl.style.display = 'inline-block';
			el.appendChild(textEl);
			titleEl.innerHTML = title;
			root.appendChild(el);
		} else {
			textEl = el.querySelector('span:last-child');
		}
		textEl.innerHTML = text;
	}
}

module.exports = log;