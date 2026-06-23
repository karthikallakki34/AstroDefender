const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ship;
let bullets = [];
let asteroids = [];
let score = 0;
let gameRunning = false;

function startGame() {

    document.getElementById("menu").style.display = "none";

    canvas.style.display = "block";

    ship = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        angle: 0
    };

    bullets = [];
    asteroids = [];
    score = 0;

    createAsteroids();

    gameRunning = true;

    requestAnimationFrame(gameLoop);
}

function createAsteroids() {

    for(let i=0;i<5;i++){

        asteroids.push({
            x: Math.random()*canvas.width,
            y: Math.random()*canvas.height,
            radius: 40,
            dx: (Math.random()-0.5)*2,
            dy: (Math.random()-0.5)*2,
            large:true
        });
    }
}

document.addEventListener("keydown", (event)=>{

    if(!gameRunning) return;

    if(event.key === "ArrowLeft"){
        ship.angle -= 0.15;
    }

    if(event.key === "ArrowRight"){
        ship.angle += 0.15;
    }

    if(event.code === "Space"){
        fireBullet();
    }
});

function fireBullet(){

    bullets.push({
        x: ship.x,
        y: ship.y,
        dx: Math.cos(ship.angle)*8,
        dy: Math.sin(ship.angle)*8
    });
}

function drawShip(){

    ctx.save();

    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(20,0);
    ctx.lineTo(-15,-10);
    ctx.lineTo(-15,10);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
}

function gameLoop(){

    if(!gameRunning) return;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawShip();

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score,20,40);

    bullets.forEach((bullet,index)=>{

        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        ctx.beginPath();
        ctx.arc(bullet.x,bullet.y,4,0,Math.PI*2);
        ctx.fill();

        if(
            bullet.x < 0 ||
            bullet.x > canvas.width ||
            bullet.y < 0 ||
            bullet.y > canvas.height
        ){
            bullets.splice(index,1);
        }
    });

    asteroids.forEach((asteroid,aIndex)=>{

        asteroid.x += asteroid.dx;
        asteroid.y += asteroid.dy;

        ctx.strokeStyle = "gray";

        ctx.beginPath();
        ctx.arc(
            asteroid.x,
            asteroid.y,
            asteroid.radius,
            0,
            Math.PI*2
        );
        ctx.stroke();

        let shipDistance = Math.hypot(
            ship.x - asteroid.x,
            ship.y - asteroid.y
        );

        if(shipDistance < asteroid.radius + 15){

            gameRunning = false;

            alert(
                "Game Over!\n\nScore: " + score
            );

            location.reload();
        }

        bullets.forEach((bullet,bIndex)=>{

            let distance = Math.hypot(
                bullet.x - asteroid.x,
                bullet.y - asteroid.y
            );

            if(distance < asteroid.radius){

                bullets.splice(bIndex,1);

                if(asteroid.large){

                    asteroids.push({
                        x: asteroid.x,
                        y: asteroid.y,
                        radius: 20,
                        dx: 3,
                        dy: -3,
                        large:false
                    });

                    asteroids.push({
                        x: asteroid.x,
                        y: asteroid.y,
                        radius: 20,
                        dx: -3,
                        dy: 3,
                        large:false
                    });
                }

                asteroids.splice(aIndex,1);

                score += 10;
            }
        });
    });

    requestAnimationFrame(gameLoop);
}