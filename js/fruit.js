const SPAWN_START = 200;
const SPAWN_RANGE = 320;
const GRAVITY = 0.0005;
const BASE_SPAWN_TIME = 2000;

let score = 0;

let fruits = [];
let fruitsSpawned = 0;
let spawnTimer = BASE_SPAWN_TIME;

function spawnFruit() {
	fruitsSpawned++;
	let x = Math.random() * SPAWN_RANGE + SPAWN_START;
	y = -100;
	fruits.push({
		"x": x,
		"y": y,
		"img": "apple",
		"dy": 0.01,
		"dx": 0,
	});
}

function updateFruit() {
	let mouthX = xPos(face.scaledMesh[13][0]);
	let moveFruit = true;
	for (let f of fruits) {
		if (f.y > 500) {
			if (biting) {
				if (Math.abs(f.x - mouthX) < 100) {
					if (fruitsSpawned == 1) {
						document.getElementById("tutorial").classList.remove("show");
					}
					fruits.splice(fruits.indexOf(f), 1);
					score++;
					document.getElementById("score").innerText = `Score: ${score}`;
					continue;
				}
			} else if (fruitsSpawned == 1 && f.y > 550) {
				moveFruit = false;
				document.getElementById("tutorial").classList.add("show");
			} else if (f.y > 700) {
				fruits.splice(fruits.indexOf(f), 1);
				continue;
			}
		}

		if (moveFruit) {
			f.x += f.dx * delta;
			f.y += f.dy * delta;
			f.dy += GRAVITY * delta;
		}

		ctx.drawImage(fruitImages[f.img], f.x - 39, f.y);
	}

	if (moveFruit) {
		spawnTimer -= delta;
		if (spawnTimer <= 0) {
			spawnTimer = BASE_SPAWN_TIME;
			spawnFruit();
		}
	}
}

spawnFruit();
