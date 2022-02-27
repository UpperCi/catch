const SPAWN_START = 200;
const SPAWN_RANGE = 320;
const GRAVITY = 0.0005;
const BASE_SPAWN_TIME = 2000;

let score = 0;

let fruits = [];
let spawnTimer = BASE_SPAWN_TIME;

function spawnFruit() {
    let x = Math.random() * SPAWN_RANGE + SPAWN_START;
    y = -100;
    fruits.push({
        'x': x,
        'y': y,
        'img': 'apple',
        'dy': 0.01,
        'dx': 0
    });
}

function updateFruit() {
    let mouthX = xPos(face.scaledMesh[13][0]);
    for (let f of fruits) {
        f.x += f.dx * delta;
        f.y += f.dy * delta;
        f.dy += GRAVITY * delta;

        if (f.y > 500) {
            if (biting) {
                if (Math.abs(f.x - mouthX) < 100) {
                    fruits.splice(fruits.indexOf(f), 1);
                    score++;
                    document.getElementById('score').innerText = `Score: ${score}`;
                    continue;
                }
            } else if (f.y > 700) {
                fruits.splice(fruits.indexOf(f), 1);
                continue;
            }
        }

        ctx.drawImage(fruitImages[f.img], f.x - 39, f.y);
    }

    spawnTimer -= delta;
    if (spawnTimer <= 0) {
        spawnTimer = BASE_SPAWN_TIME;
        spawnFruit();
    }
}

spawnFruit();
