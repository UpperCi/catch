let objUrl = "https://raw.githubusercontent.com/google/mediapipe/master/mediapipe/modules/face_geometry/data/canonical_face_model.obj";

let headPolygonIndicies = [[54, 103, 68]];
let lipPolygonIndicies = [];
let mouthPolygonIndicies = [];

function calcPolys() {
    fetch(objUrl)
    .then(res => res.text())
    .then(data => handleObj(data));
}
// parses polygons from obj file at {objUrl}
function handleObj(data) {
    headPolygonIndicies = [];
    let lines = data.split(/\r?\n/);
    for (let line of lines) {
        if (line[0] == 'f') {
            let faces = line.split("/");
            let face = [];
            for (let i = 0; i < 3; i++) {
                let faceData = faces[i]
                face.push(
                    parseInt(faceData.substr(faceData.indexOf(" ") + 1)) - 1
                )
            }
            headPolygonIndicies.push(face);
        }
    }
}
// generates polygons for lips. Flipping camera removes annotations so these are loaded in from JSON
function calcLips() {
    console.log(face);
    lipPolygonIndicies = [];
    
	let lowerLipOuter = face.annotations.lipsLowerOuter;
	let lowerLipInner = face.annotations.lipsLowerInner;
	let upperLipInner = face.annotations.lipsUpperInner;
	let upperLipOuter = face.annotations.lipsUpperOuter;

    let lowerLip = [];
	let upperLip = [];
    let innerLip = [];

    lowerLip.push(upperLipOuter[0]);

	for (let i = 0; i < 11; i++) {
		if (i < 10) lowerLip.push(lowerLipOuter[i]);
		lowerLip.push(lowerLipInner[i]);
		upperLip.push(upperLipInner[i]);
		upperLip.push(upperLipOuter[i]);
		innerLip.push(lowerLipInner[i]);
		innerLip.push(upperLipInner[i]);
	}

    for (let i = 0; i < lowerLip.length - 2; i++) {
        let lipPoly = [];
        for (let j = 0; j < 3; j++) {
            let pt = lowerLip[i + j];
            let pt_i = face.scaledMesh.indexOf(pt);
            lipPoly.push(pt_i);
        }
        lipPolygonIndicies.push(lipPoly);
        lipPoly = [];
        for (let j = 0; j < 3; j++) {
            let pt = upperLip[i + j];
            let pt_i = face.scaledMesh.indexOf(pt);
            lipPoly.push(pt_i);
        }
        lipPolygonIndicies.push(lipPoly)
        lipPoly = [];
        for (let j = 0; j < 3; j++) {
            let pt = innerLip[i + j];
            let pt_i = face.scaledMesh.indexOf(pt);
            lipPoly.push(pt_i);
        }
        mouthPolygonIndicies.push(lipPoly)
    }
}

function getLips() {
    fetch("polygons.json")
    .then(res => res.json())
    .then(data => {
        lipPolygonIndicies = data['lipPolygonIndicies'];
        mouthPolygonIndicies = data['mouthPolygonIndicies'];
    }) 
}
