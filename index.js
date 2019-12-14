const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Canvas Frame Settings
canvas.width = window.innerWidth
canvas.height = window.innerHeight - 50

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;

// Img Settings
const ballImg = document.getElementById('ball');
const holeImg = document.getElementById('hole');
const win = document.getElementById('win');

// Audio Settings
let back = new Audio();
let dead = new Audio();
let goal = new Audio();
let wall = new Audio();

back.src = "./Audio/back.mp3";
dead.src = "./Audio/itsgood.mp3";
goal.src = "./Audio/goal.mp3";
wall.src = "./Audio/dead.mp3";


// Character And SpeedKeep Settings
let character = { x: canvasWidth / 2 - 35, y: canvasHeight - 100, width: 60, height: 60 };
let speedKeep = 0;

let hole = { x: 0, y: 80, width: 200, height: 80 };
let holeSpeed = 20;

// Wall Math Setting
let wallX, wallY, wallH, wallW;
function wallFunc() {
    wallX = Math.floor(Math.random() * canvasWidth);
    wallY = canvasHeight / 2;
    wallW = Math.floor(Math.random() * canvasWidth / 2) + 500
    wallH = 50;
}
wallFunc()

// Keypress Events
document.addEventListener('keypress', keyPressFunc);
function keyPressFunc(event) {
    switch (event.keyCode) {
        case 32:
            speedKeep += (speedKeep > 750) ? 0 : -30;
            break;
        default:
            break;
    }
}

document.addEventListener('keydown', keyDownFunc);
function keyDownFunc(event) {
    switch (event.keyCode) {
        case 37:
            character.x += -30;
            break;
        case 39:
            character.x += 30;
            break;
        default:
            break;
    }
}

// SetInterval Settings
const interval = setInterval(() => {
    // back.play()
    back.volume = 0.5

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    character.y += speedKeep

    if (character.x >= hole.x && character.x <= hole.x + hole.width && character.y >= hole.y && character.y <= hole.y + hole.height) {
        goal.play()
        dead.muted = true
        back.muted = true
        setTimeout(() => {
            context.beginPath();
            context.font = '3em sans-serif';
            context.fillStyle = '#0da958';
            context.fillRect(0, 0, canvasWidth, canvasHeight);
            context.drawImage(win, canvasWidth / 2, canvasHeight / 2 - 200, 100, 100);
            context.fillStyle = 'white';
            context.fillText('GooooooooooooL', canvasWidth / 2 - 150, canvasHeight / 2);
            context.closePath();
            clearInterval(interval);
        }, 0);
    }

    if (character.y < hole.y) {
        dead.play()
    }

    if (character.y < 0) {
        speedKeep = 0
        character.y = canvasHeight - 100;
    }

    // HoleSpeed Rules
    hole.x += holeSpeed
    if (hole.x > (canvasWidth - 220) || hole.x < 20) {
        holeSpeed = holeSpeed * -1
        wallFunc()
    }

    // Wall Drawing And Rules
    context.fillRect(wallX, wallY, wallW, wallH);
    if (character.x >= wallX - 50 && character.x <= wallX + wallW && character.y >= wallY && character.y <= wallY + wallH) {
        wall.play()
        character.y = canvasHeight - 100;
        speedKeep = 0;
        wallFunc()
    }

    // Hole Drawing
    context.drawImage(holeImg, hole.x, hole.y - 20, hole.width, hole.height + 40);

    // Ball Drawing
    context.drawImage(ballImg, character.x, character.y);
}, 100);
