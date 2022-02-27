function shade(pts, opts) {
	let left = -1;
	let leftX = 10000;
	let right = 1;
	let rightX = -1;

	let baseColor = opts.baseColor ? opts.baseColor : [160, 160, 160];
	let mod = (opts.mod != null) ? opts.mod : 8;
	if (mod == 0) {
		ctx.fillStyle = `rgb(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]})`;
		return;
	}
	let rMod = opts.rMod != null ? opts.rMod : mod;
	let gMod = opts.gMod != null ? opts.gMod : mod;
	let bMod = opts.bMod != null ? opts.bMod : mod;
	let sortDir = opts.sortDir ? opts.sortDir : 0;
	let shadeDir = opts.shadeDir ? opts.shadeDir : 2;

	for (let i in pts) {
		p = pts[i];
		if (p[sortDir] < leftX) {
			left = i;
			leftX = p[sortDir];
		} if (p[sortDir] > rightX) {
			right = i;
			rightX = p[sortDir];
		}
	}

	let diff = (pts[left][shadeDir] - pts[right][shadeDir]) / Math.abs(leftX - rightX) * 15;
	diff = Math.min(15, Math.max(-15, diff));
	let r = Math.min(255, Math.max(0, baseColor[0] + rMod * diff));
	let g = Math.min(255, Math.max(0, baseColor[1] + gMod * diff));
	let b = Math.min(255, Math.max(0, baseColor[2] + bMod * diff));

	ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
}

function renderPolygons(points, polys, opts = {}) {
	for (let p of polys) {
		try {
			ctx.beginPath();
			let startPoint = points[p[0]];
			ctx.moveTo(xPos(startPoint[0]), yPos(startPoint[1]));
			ctx.lineTo(xPos(points[p[1]][0]), yPos(points[p[1]][1]));
			ctx.lineTo(xPos(points[p[2]][0]), yPos(points[p[2]][1]));
			ctx.lineTo(xPos(startPoint[0]), yPos(startPoint[1]));
			ctx.closePath();
			shade([points[p[0]], points[p[1]], points[p[2]]], opts);
			ctx.fill();
		} catch (e) {
			console.log(p);
			console.error(e);
		}
	}
}