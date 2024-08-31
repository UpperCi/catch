const SPAWN_START = 200;
const SPAWN_RANGE = 320;
const GRAVITY = 0.0003;
const BASE_SPAWN_TIME = 2000;

let score = 0;
let strikes = 0;

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

function drawStrikes() {
	const strikeText = "X".repeat(strikes).padEnd(3, 'O');
	document.getElementById("strikes").innerText = `Strikes: ${strikeText}`;
}

function drawScore() {
	document.getElementById("score").innerText = `Score: ${score}`;
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
					drawScore();
					continue;
				} else if (fruitsSpawned == 1) {
					moveFruit = false;
				}
			} else if (fruitsSpawned == 1 && f.y > 550) {
				moveFruit = false;
				document.getElementById("tutorial").classList.add("show");
			} else if (f.y > 700) {
				strikes++;
				drawStrikes();
				if (strikes >= 3) {
					document.getElementById("restart").classList.add("show");
					if (score > highScore) highScore = score;
					document.getElementById("high-score").innerText = `High Score: ${highScore}`;
					paused = true;
				}
				fruits.splice(fruits.indexOf(f), 1);
				continue;
			}
		}

		if (moveFruit) {
			f.x += f.dx * delta;
			f.y += f.dy * delta;

			const acceleration = GRAVITY * (1 + (0.3 * fruitsSpawned));
			f.dy += acceleration * delta;
		}

		ctx.drawImage(fruitImages[f.img], f.x - 39, f.y);
	}

	if (moveFruit) {
		spawnTimer -= delta;
		if (spawnTimer <= 0) {
			const nextSpawnTime = BASE_SPAWN_TIME * (1 / (1 + (0.1 * fruitsSpawned)));
			spawnTimer = nextSpawnTime;
			spawnFruit();
		}
	}
}

spawnFruit();
