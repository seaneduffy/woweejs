'use strict';

let glm = require('gl-matrix'),
	mat3 = glm.mat3;

let trans = mat3.fromValues(0, 
174.48599243164062, 
77.843994140625, 
47.66439437866211, 
0, 
75.02880859375, 
1, 
1, 
1);

function invertMat3(m) {
	let a00 = m[0], a01 = m[1], a02 = m[2],
		a10 = m[3], a11 = m[4], a12 = m[5],
		a20 = m[6], a21 = m[7], a22 = m[8];
		
	let mm00 = a11 * a22 - a12 * a21,
		mm01 = a10 * a22 - a12 * a20,
		mm02 = a10 * a21 - a11 * a20,
		mm10 = a01 * a22 - a02 * a21,
		mm11 = a00 * a22 - a02 * a20,
		mm12 = a00 * a21 - a01 * a20,
		mm20 = a01 * a12 - a02 * a11,
		mm21 = a00 * a12 - a02 * a10,
		mm22 = a00 * a11 - a01 * a10;
		
	let mc00 = mm00,
		mc01 = -mm01,
		mc02 = mm02,
		mc10 = -mm10,
		mc11 = mm11,
		mc12 = -mm12,
		mc20 = mm20,
		mc21 = -mm21,
		mc22 = mm22;
		
	let ma00 = mc00,
		ma01 = mc10,
		ma02 = mc20,
		ma10 = mc01,
		ma11 = mc11,
		ma12 = mc21,
		ma20 = mc02,
		ma21 = mc12,
		ma22 = mc22;
		
	let d = 1 / (a00 * mm00 + a01 * mm01 + a02 * mm02);
	
	let out = new Float32Array(9);
	
	out[0] = ma00 * d;
	out[1] = ma01 * d;
	out[2] = ma02 * d;
	out[3] = ma10 * d;
	out[4] = ma11 * d;
	out[5] = ma12 * d;
	out[6] = ma20 * d;
	out[7] = ma21 * d;
	out[8] = ma22 * d;
	
	return out;
}

//let tI = mat3.invert(mat3.create(), trans);

let tI = invertMat3([0, 
174.48599243164062, 
77.843994140625, 
47.66439437866211, 
0, 
75.02880859375, 
1, 
1, 
1]);

let m1 = mat3.mul(mat3.create(), tI, trans);

let m2 = mat3.mul(mat3.create(), trans, tI);

//console.log(m1);
//console.log(m2);


var a = [-0.008842425420880318, -0.01138962060213089, 1.542879343032837, 0.003224998479709029, -0.009174205362796783, 0.4372829496860504, 0.005617426708340645, 0.020563825964927673, -0.9801623225212097];
var b = [539.52001953125,523.5838623046875,516.4718017578125,407.4570007324219,399.9157409667969,400.2358703613281,1,1,1];
console.log( b[6] * a[2] + b[7] * a[5] + b[8] * a[8]);