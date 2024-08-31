let lipDistance = 0;
let biting = false;
let openMouth = false;
const MOUTH_TRESHOLD = 10;
const H_BOUNDS = 300;
const Y_BOTTOM = 750;

/* Camera xpos calc
Get size of horizontal playing field (res.x - boundingbox.x)
Get center of boundingBox
Map boundingbox from playing field to 720px
*/

function updateBounds() {
	ctx.fillStyle = "#444488";
	let baseTopLeft = face.boundingBox.topLeft[0];
	let baseBottomRight = face.boundingBox.bottomRight[0];
	let baseSize = [baseBottomRight[0] - baseTopLeft[0], baseBottomRight[1] - baseTopLeft[1]]

	let mod = H_BOUNDS / baseSize[0];
	xMod = -mod;
	yMod = mod;

	let topLeft = pos(baseTopLeft);
	let bottomRight = pos(baseBottomRight);
	let size = pos(baseSize);
	yOffset = Y_BOTTOM - bottomRight[1] + yOffset;

	let fieldSize = 720 - baseSize[0]; // bigger when smaller bounding box
	let fieldMod = 720 / fieldSize; // bigger when bigger bounding box
	let middle = (baseTopLeft[0] + baseBottomRight[0]); // does not scale with bounding box
	xOffset = -(middle - (720 + fieldSize) * 0.4) * (fieldMod - 1) + 720;
}

function updateLips() {
	biting = false;
	if (lipPolygonIndicies.length <= 0) getLips();

	lipDistance = distanceTo(face.scaledMesh[13], face.scaledMesh[14]);
	
	let mouthColor = [230, 230, 230];

	if (lipDistance > MOUTH_TRESHOLD) {
		mouthColor = [0, 0, 0];
		openMouth = true;
	} else {
		if (openMouth) {
			biting = true;
		}
		openMouth = false;
	}

	renderPolygons(face.scaledMesh, lipPolygonIndicies, { baseColor: [255, 0, 0], sortDir: 1 });
	renderPolygons(face.scaledMesh, mouthPolygonIndicies, { baseColor: mouthColor, mod: 0 });
}

function update() {
	ctx.fillStyle = "#413926";
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	updateBounds();

	renderPolygons(face.scaledMesh, headPolygonIndicies);

	updateLips()

	updateFruit();
}
