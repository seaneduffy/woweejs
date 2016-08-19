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

loadData('/tie1.json', function(data){
	var triangleCounter = 0,
		valueCounter = 0,
		v,
		triangle,
		triangles = [];
		console.log(data);
		var s = mat4.scale(mat4.create(), mat4.create(), vec3.fromValues(10, 10, 10));
		var max = 0,
			count = 0;
	data.faces.forEach(function(vertices){
		var triangle = new Triangle();
		vertices.forEach(function(vertex, index){
			v = vertex.vertex;
			//triangle[index] = vec3.transformMat4(vec3.create(), vec3.fromValues(v[2], v[1], v[0]), s);
			triangle[index] = vec3.fromValues(v[2], v[1], v[0]);
		});
		obj.model.shapes.push(triangle);
	});
});

//let t = new Triangle(-100, 100, 0, 0, 0, 0, 100, 100, 0);
let obj = new DisplayObject3D();
obj.model = new Model();
//obj.model.shapes.push(t);
obj.position = vec3.fromValues(0, 0, 0);
viewport.camera = camera;
viewport.addChild(obj);
obj.z = .9;
//camera.rotationY = Math.PI / 180 * 90;
new Tween(obj, {'z': .6, 'y': 20, 'rotationY': Math.PI / 180 * 80}, 4, 'linear', '+');