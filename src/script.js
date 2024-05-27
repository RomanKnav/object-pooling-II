// MAIN OBJECTIVE: make the automatic gun SEMI-auto.

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    width: 50,
    height: 50,
    color: 'blue',
    shooting: false
};

// difference between these 2 arrays?
// projectiles contains the active projectiles (once here, projectiles move).
// projectilePool is the reserve. 

//PROJECTILES VARS:
/* projectilePool has no max limit. It goes as high as fast as the player is able to 
tap the shoot button before */
const projectiles = [];
const projectilePool = [];
const keys = {};

// this var is single-handedly responsible for making semi-automaic.
// no need for complex ass setTimer logic. 
let canShoot = true;

// shoot projectile
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space') {
        shootProjectile();
        canShoot = false;
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
    canShoot = true;
});

function updatePlayer() {
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= 5;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += 5;
    }
}

// this draws projectile (not update it), and pushes it to "projectiles"
// INDEFINITELY starts projectile path.
function shootProjectile() {
    const projectile = createProjectile();
    projectile.x = player.x + player.width / 2 - projectile.width / 2;
    projectile.y = player.y;
    projectile.active = true;

    if (canShoot) projectiles.push(projectile);
}

// if we got stuff in "projectilePool", get first item. Otherwise, 
// create an object with projectile properties. Set to "projectile" 
// in shootProjectile() func. 
function createProjectile() {
    if (projectilePool.length > 0) {
        // pretty much impossible for projectilePool to become empty. 
        return projectilePool.pop();
    } else {
        // the x/y coords are temporary. Get set in shootProjectile to player's
        // current x/y. 
        return { x: 0, y: 0, width: 5, height: 10, color: 'red', active: false };
    }
}

// so, as soon as projectile leaves canvas, push it back to projectile pool. 
function updateProjectiles() {
    for (let i = 0; i < projectiles.length; i++) {
        const projectile = projectiles[i];
        // bullet moves only if active. 
        if (projectile.active) {
            projectile.y -= 5;
            if (projectile.y < 0) {
                projectile.active = false;
                // when projectile reaches end of canvas, move it from "projectiles" to "projectilePool"
                projectilePool.push(projectiles.splice(i, 1)[0]);
                i--;
            }
        }
    }
}

// draw all the active projectiles
function drawProjectiles() {
    ctx.fillStyle = 'red';
    projectiles.forEach((projectile) => {
        if (projectile.active) {
            ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
        }
    });
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePlayer();
    updateProjectiles();
    drawPlayer();
    drawProjectiles();
    requestAnimationFrame(gameLoop);

    // console.log(projectiles, projectilePool);
}

gameLoop();
