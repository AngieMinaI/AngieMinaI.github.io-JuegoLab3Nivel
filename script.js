const canvas = document.getElementById('game');
const collisionSound = new Audio('collision.mp3');
const coinSound = new Audio('coin.mp3');
const fondoMusic = new Audio('fondo.mp3');
fondoMusic.loop = true;
fondoMusic.volume = 0.4;

const ctx = canvas.getContext('2d');
// Objt para rastrear teclas direccionales
let keys= {};
document.addEventListener('keydown', (e) => keys[e.key]=true);
document.addEventListener('keyup', (e) => keys[e.key]=false);
//definicion del jugador
const player = {x:50, y:50, w:30, h:30, color: 'red', speed: 3};
//definicion de los niveles con obstaculos y monedas
const levels = [
    {
        obstacles: [
            {x: 100, y: 150, w: 400, h: 20 },
            {x: 300, y: 250, w: 20, h: 100}
        ],
        coins: [
            {x: 500, y:50, collected: false},
            {x: 50, y: 300,collected: false}
        ]
    },
    {
        obstacles: [
            {x: 200, y: 100, w: 200, h: 20 },
            {x: 200, y: 200, w: 20, h: 100},
            {x: 400, y: 200, w: 20, h: 100}
        ],
        coins: [
            {x: 50, y:50, collected: false},
            {x: 550, y: 350, collected: false},
            {x: 300, y: 180, collected: false}
        ]

    },
    {
        obstacles: [
            {x: 100, y: 100, w: 400, h: 20},
            {x: 100, y: 280, w: 400, h: 20},
            {x: 200, y: 30, w: 20, h: 200},
            {x: 350, y: 170, w: 20, h: 200},
          
            
        ],
        coins: [
            {x: 320, y: 120, collected: false},
            {x: 120, y: 250, collected: false},
            {x: 460, y: 260, collected: false}
        ]
    }
];

let currentLevel = 0;
let score = 0;

//funcion para detectar colisiones entre dos rectangulos

function rectsCollide(a, b){
    return(
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
        );
}

//funcion para dibujar un rectangulo (jugado u obstaculo)
function drawRect(obj) {
    ctx.fillStyle = obj.color || 'white';
    ctx.fillRect(obj.x, obj.y, obj.w, obj.h);

}

//funcion uqe actualiza la logica del juego

function update(){
    const level = levels[currentLevel];

    fondoMusic.play();
    //movimiento de jugador segun las teclas presionadas
    if(keys['ArrowUp']) player.y -= player.speed;
    if(keys['ArrowDown']) player.y += player.speed;
    if(keys['ArrowLeft']) player.x -= player.speed;
    if(keys['ArrowRight']) player.x += player.speed;

    //comporbacion de colision con obstaculos y retroceso del movimiento

    for(let obs of level.obstacles){
        if(rectsCollide(player, obs)){
            collisionSound.currentTime = 0; // Reinicia el sonido si ya se está reproduciendo
            collisionSound.play(); //Reproduce el sonido
           if(keys['ArrowUp']) player.y += player.speed;
           if(keys['ArrowDown']) player.y -= player.speed;
           if(keys['ArrowLeft']) player.x += player.speed;
           if(keys['ArrowRight']) player.x -= player.speed; 
        }
    }

    //comprobacion de colision con monedas y recolección
    for(let coin of level.coins){
        if(!coin.collected){
            if (
                player.x < coin.x + 15 &&
                player.x + player.w > coin.x &&
                player.y < coin.y + 15 &&
                player.y + player.h > coin.y
                ) {
                coin.collected = true; //marca la moneda como recogida
                score++;
                coinSound.currentTime = 0; // Reinicia el sonido si ya se está reproduciendo
                    coinSound.play(); // Reproduce el sonido de la moneda
            }
        }      
}

//verifica si todas las monedas del nivel han sido recogidas
const allCollected = level.coins.every(c => c.collected);
if(allCollected){
    if(currentLevel < levels.length - 1){
        currentLevel++;
        resetLevel();
    } else{
        requestAnimationFrame(() => {
        keys = {};
        //fin del juego: muestra mensaje y reinicia
        alert("¡Felicitaciones Angie Mina Ishuiza!");
        fondoMusic.currentTime = 0; // Reinicia la música
        fondoMusic.play(); // Reproduce la música
        currentLevel = 0;
        score = 0;
        resetLevel();
    });
    }

}
// Colisión con los límites del canvas
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;
    if (player.y + player.h > canvas.height) player.y = canvas.height - player.h;
}
//funcion para reiniciar la posicion del jugador y el estado de las monedas
function resetLevel(){
    player.x = 80;
    player.y = 10;
    levels[currentLevel].coins.forEach(c => c.collected = false);
}


//dibujando todos los elementos del juego
function draw(){
    //limpian el lienzo
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //dibuja al jugador
    drawRect(player);

    const level = levels[currentLevel];
    //dibujar los obstaculos
    for(let obs of level.obstacles){
        drawRect({...obs, color: 'gray'});

    }
     //dibujando las monedas
     for(let coin of level.coins){
        if(!coin.collected){
            ctx.fillStyle='gold';
            ctx.beginPath();
            ctx.arc(coin.x + 7.5, coin.y + 7.5, 7.5, 0, Math.PI * 2);
            ctx.fill();

        }
     }
     //Muestra el numero del nivel actual
     ctx.fillStyle = 'white';
     ctx.fillText(`Nivel: ${currentLevel + 1}`, 10, 20);
     ctx.fillText(`Score: ${score}`, 10, 40);

}

//bucle principal del juego
function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
resetLevel();
gameLoop();