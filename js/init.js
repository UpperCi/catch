let face = {};
let facemesh;
let canvas, ctx;
let xOffset = 0, yOffset = 0;
let xMod = 1, yMod = 1;
let fruitImages = {};

let xPos = x => x * xMod + xOffset;
let yPos = y => y * yMod + yOffset;
let pos = p => [xPos(p[0]), yPos(p[1])];

const video = document.getElementById('video');

let cameraRes = [720, 720];

let last_ms = 0;
let delta = 0;

let distanceTo = (p1, p2) => {
	let rawX = Math.abs(p1[0] - p2[0]);
	let rawY = Math.abs(p1[1] - p2[1]);
	return Math.sqrt(rawX * rawX + rawY * rawY);
}

navigator.getUserMedia = (navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia);

function initFruitImages() {
	let appleImage = new Image();
	appleImage.src = "assets/apple.png";
	fruitImages['apple'] = appleImage;
}

function initApplication() {
	canvas = document.createElement('canvas');
	document.querySelector("game").appendChild(canvas);
	ctx = canvas.getContext('2d', { alpha: false });
	canvas.width = 720;
	canvas.height = 720;

	calcPolys();

	navigator.getUserMedia(
		{ video: {} },
		stream => {
			initialized = true;
			video.srcObject = stream;
			let stream_settings = stream.getVideoTracks()[0].getSettings();
			cameraRes = [stream_settings.width, stream_settings.height];
			console.log(cameraRes)
		},
		err => console.error(err)
	);

	initFruitImages()

	facemesh = ml5.facemesh(video, { maxFaces: 1 }, modelLoaded);
	requestAnimationFrame((ms) => { 
		last_ms = ms;
		loop();
	});
}

function loop(ms) {
	if ("faceInViewConfidence" in face) update();
	delta = ms - last_ms;
	if (delta > 100) delta = 16;
	last_ms = ms;
	requestAnimationFrame((d) => { loop(d) });
}

function modelLoaded() {
	console.log('Model Loaded!');
}

initApplication();

// Listen to new 'face' events
facemesh.on('face', results => {
	if (results.length > 0) face = results[0];
});