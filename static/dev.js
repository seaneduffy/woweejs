'use strict';

let game = wowee({
	root: document.getElementById("game"), 
	width: 500, 
	height: 500,
	background: "black"
});

function loadData(uri, cb) {
	let xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', uri, true);   
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			cb(JSON.parse(xobj.responseText));
		}
	}
	xobj.send(null);
}

let camera = new Camera();

loadData('/sphere1.json', function(data){
	var triangleCounter = 0,
		valueCounter = 0,
		v,
		triangle,
		triangles = [];
		console.log(data);
		var s = mat4.scale(mat4.create(), mat4.create(), vec3.fromValues(100, 100, 100));
		var max = 0,
			count = 0;
	data.vertexPositionIndices.forEach(function(index){
		if(valueCounter === 0 && triangleCounter === 0) {
			triangle = new Triangle();
		}
		if(valueCounter === 0) {
			v = vec3.create();
		}
		v[valueCounter] = data.vertexPositions[index];
		valueCounter++;
		if(valueCounter >= 3) {
			valueCounter = 0;
			v = vec3.transformMat4(vec3.create(), v, s);
			triangle[triangleCounter] = v;
			triangleCounter++;
			if(triangleCounter >= 3) {
				triangleCounter = 0;
				obj.model.shapes.push(triangle);
			}
		}
	});
	viewport.render();
	/*data.vertex.forEach( function(value, index){
		
		if(triangleCounter === 0 && valueCounter === 0) {
			triangle = new Triangle(0,0,0,0,0,0,0,0,0);
		}
		if(valueCounter === 0) {
			triangle[triangleCounter] = vec3.create();
		}
		
		triangle[triangleCounter][valueCounter] = value;
		
		valueCounter++;
		if(valueCounter > 2) {
			valueCounter = 0;
			triangleCounter++;
			if(triangleCounter > 2) {
				triangleCounter = 0;
				triangles.push(triangle);
			}
		}
	} );
	triangles.forEach(function(t){
		var t = new Triangle();
			t[0][0] = triangle[0][0];
			t[0][1] = triangle[0][1];
			t[0][2] = triangle[0][2];
			t[1][0] = triangle[1][0];
			t[1][1] = triangle[1][1];
			t[1][2] = triangle[1][2];
			t[2][0] = triangle[2][0];
			t[2][1] = triangle[2][1];
			t[2][2] = triangle[2][2];
	
		var s = dmat4.scale(mat4.create(), mat4.create(), vec3.fromValues(100, 100, 100));
	
		vec3.transformMat4(t[0], t[0], s);
		vec3.transformMat4(t[1], t[1], s);
		vec3.transformMat4(t[2], t[2], s);
	
		obj.model.shapes.push(t);
	})*/
});

//let t = new Triangle(-100, 100, 0, 0, 0, 0, 100, 100, 0);
let obj = new DisplayObject3D();
obj.model = new Model();
//obj.model.shapes.push(t);
obj.position = vec3.fromValues(0, 0, 0);
viewport.camera = camera;
viewport.addChild(obj);

camera.rotationY = Math.PI / 180 * 90;
//new Tween(camera, {'rotationY': Math.PI / 180 * 1}, 2, 'linear');