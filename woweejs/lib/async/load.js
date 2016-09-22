'use strict';

module.exports = function(uri, dataType) {
	return new Promise(function(resolve, reject){
		
		if(dataType === 'image') {
			var image = new Image();
			image.onload = function(){
				resolve(image);
			};
			image.src = uri;
		} else {
			let xobj = new XMLHttpRequest();
			xobj.overrideMimeType("application/json");
			xobj.open('GET', uri, true);   
			xobj.onreadystatechange = function(){
				if (xobj.readyState == 4 && xobj.status == "200") {
					if(dataType === 'text') {
						resolve(xobj.responseText);
					} else {
						resolve(JSON.parse(xobj.responseText));
					}
				}
			}
			xobj.send(null);
		}
	});
}