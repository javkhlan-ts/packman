const ghostColors = ['magenta', 'coral', 'cyan', 'crimson'];
const myBoard = [];
const gameBoard = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 1,
    1, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 2, 1,
    1, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 1,
    1, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 1,
    1, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 1,
    1, 2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1,
    1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1,
    1, 2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1,
    1, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 1,
    1, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 1,
    1, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 1,
    1, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 2, 1,
    1, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
];

keyz = {ArrowRight: false, ArrowLeft: false, ArrowUp: false, ArrowDown: false};

const ghosts = [];
const player = { pos: 162, speed: 8, cool: 0, pause: false, 
    score: 0, lives: 5, gameover: true, gamewin: false, powerup: false, powerCount: 0}
const g = { x:'', y:'', h:65, size:15, ghostno:4, inplay:false }

const startGameBtn = document.querySelector('.start-game-btn');

///EVENT LISTENERS
document.addEventListener('DOMContentLoaded',()=>{
    g.grid =  document.querySelector('.grid');
    g.pacman = document.querySelector('.pacman');
    g.eye = document.querySelector('.eye');
    g.mouth = document.querySelector('.mouth');
    g.ghost = document.querySelector('.ghost');
    g.score = document.querySelector('.score');
    g.lives = document.querySelector('.lives');
    g.pacman.style.display = 'none';
    g.ghost.style.display = 'none';
    g.grid.style.display = 'none';
    document.querySelector('.game-over').style.display = 'none';
    document.querySelector('.you-won').style.display = 'none';
})

document.addEventListener('keydown', (e) => {
    if(e.code in keyz){
        keyz[e.code] = true;
    }
    if(!g.inplay && !player.pause){
        g.inplay = true;
        player.play = requestAnimationFrame(mainGamePlay);
    }
})

document.addEventListener('keyup', (e)=>{
    if(e.code in keyz){
        keyz[e.code] = false;
    }
})

startGameBtn.addEventListener('click', startGame);

///MAIN GAMEPLAY
function mainGamePlay(){
    if(g.inplay){
        player.cool--; //player slowdown
        if(player.cool < 0){
            //when pacman is powered up
            if(player.powerup){
                player.powerCount--;
                g.pacman.style.backgroundColor = 'red';
                if(player.powerCount < 20){
                    g.pacman.style.backgroundColor = 'orange';
                    if(player.powerCount%2){
                        g.pacman.style.backgroundColor = 'white';
                    }
                }
                if(player.powerCount <= 0){
                    console.log("Power down!");
                    player.powerup = false;
                    g.pacman.style.backgroundColor = 'yellow';
                }
            }

            //placing ghosts
            ghosts.forEach((ghost) => { 
                ghost.style.backgroundColor = ghost.defaultColor;
                if (player.powerCount > 0) {
                    ghost.style.backgroundColor = (player.powerCount%2) ? 'white' : ghost.defaultColor;
                }
                myBoard[ghost.pos].append(ghost);
                //start moving ghosts
                ghost.counter--;
                let oldPOS = ghost.pos; //curr pos of ghost
                if(ghost.counter <= 0){
                    changeDir(ghost);
                } else {
                    if(ghost.dx ==0 ){ ghost.pos -= g.size;}
                    else if(ghost.dx ==1 ){ ghost.pos += g.size;}
                    else if(ghost.dx ==2 ){ ghost.pos += 1;}
                    else if(ghost.dx ==3 ){ ghost.pos -= 1;}
                }

                ///***FREEZE GHOSTS FOR TESTING***
                // ghost.pos = oldPOS;
                ///***FREEZE GHOSTS FOR TESTING***

                //if ghost catches pacman
                if(player.pos == ghost.pos){
                    // console.log('Ghost got you '+ ghost.namer);
                    if(player.powerCount > 0){
                        //PACMAN EATS THE GHOST
                        player.score += 50;
                        ghost.style.display = 'none';
                        setTimeout(function(){
                            ghost.pos = 17; //GHOST REBORN POS
                            ghost.style.display = 'block';
                        }, 5000);
                    } else {
                        //PACMAN LOSES A LIFE
                        player.lives--;
                        gameReset();
                    }
                    updateScore();
                }

                let valGhost = myBoard[ghost.pos]; //future pos of ghost
                if(valGhost.t == 1){
                    ghost.pos=oldPOS;
                    changeDir(ghost);
                }
                myBoard[ghost.pos].append(ghost);
            })

            //keyboard events mainGamePlayment of player
            let tempPos = player.pos; //current position
            if(keyz.ArrowRight){
                player.pos+=1;
                g.eye.style.left = '35%';
                g.mouth.style.left = '65%';
            }else if(keyz.ArrowLeft){
                player.pos-=1;
                g.eye.style.left = '50%';
                g.mouth.style.left = '0%';
            }else if(keyz.ArrowUp){
                player.pos -=g.size;
            }else if(keyz.ArrowDown){
                player.pos +=g.size;
            }

            let newPlace = myBoard[player.pos]; //future position
            //recognize wall
            if(newPlace.t == 1){
                player.pos = tempPos;
            }
            //eat dots
            if(newPlace.t == 2){ //dots eaten
                myBoard[player.pos].innerHTML = '';
                //dots counter for WIN
                let tempDots = document.querySelectorAll('.dot');
                if(tempDots.length == 0){
                    console.log("You win!");
                    playerWins();
                };        
                player.score++;
                updateScore();
                newPlace.t = 0;
            }
            //powerup
            if(newPlace.t == 3){
                console.log("Powered up!");
                myBoard[player.pos].innerHTML = '';
                player.powerCount = 80;
                player.powerup = true;
                player.score+=10;
                updateScore();
                newPlace.t = 0; //else pacman powers up when over again
            }
            //mouth mainGamePlayment
            if(player.pos != tempPos){
                if(player.tog){
                    g.mouth.style.height = '20%';
                    player.tog = false;
                } else {
                    g.mouth.style.height = '10%';
                    player.tog = true;
                }
            }
            player.cool = player.speed; //set cooloff
        }
        //no more move if pacman is caught resetGame()
        if(!player.pause){
            myBoard[player.pos].append(g.pacman);
            player.play = requestAnimationFrame(mainGamePlay);
        }
    }
}

///START AND RESET
function startGame(){
    //set default values
    myBoard.length = 0;
    ghosts.length = 0;
    g.grid.innerHTML = '';
    g.x = '';
    player.score = 0;
    player.lives = 5;
    player.gamewin = false;
    player.gameover = false;
    g.grid.style.display = 'grid';
    g.pacman.style.display = 'block';
    startGameBtn.style.display = 'none';
    document.querySelector('.game-over').style.display = 'none';
    document.querySelector('.you-won').style.display = 'none';

    createGame();
    updateScore();
    g.grid.focus();
}

function playerWins(){
    player.gamewin = true;
    player.pause = true;
    g.inplay = false;
    startGameBtn.style.display = 'block';
    document.querySelector('.you-won').style.display = 'block';
}

function gameReset() {
    window.cancelAnimationFrame(player.play);
    g.inplay=false;
    player.pause=true;
    if(player.lives <= 0){
        player.gameover = true;
        player.gamewin = false;
        startGameBtn.style.display = 'block';
    }
    if(!player.gameover){
        setTimeout(startPos, 3000);
    }
}

function startPos() {
    player.pause = false;
    let firstStartPos = 152;
    player.pos = startPosPlayer(firstStartPos);
    myBoard[player.pos].append(g.pacman);
    ghosts.forEach((ghost, ind) => {
        let temp = (g.size + 1) + ind;
        ghost.pos = startPosPlayer(temp);
        myBoard[ghost.pos].append(ghost);
    })
}

function startPosPlayer(val) { //it is player and ghost position!
    if(myBoard[val].t != 1) {
        return val;
    }
    return startPosPlayer(val + 1);
}

///GAME UPDATES
function updateScore() {
    if(player.lives <= 0) {
        player.gameover = true;
        document.querySelector('.game-over').style.display = 'block';
    } else {
        g.score.innerHTML = `Score : ${player.score}`;
        g.lives.innerHTML = `Lives : ${player.lives}`;
    }
}

///GAME BOARD SETUP
function createGhost(){
    let newGhost = g.ghost.cloneNode(true);
    newGhost.pos = 64 + ghosts.length;
    newGhost.style.display = 'block';
    newGhost.counter = 0;
    newGhost.dx = Math.floor(Math.random()*4);
    newGhost.defaultColor = ghostColors[ghosts.length];
    newGhost.style.backgroundColor = ghostColors[ghosts.length];
    // newGhost.style.opacity = '0.9';
    newGhost.namer = ghostColors[ghosts.length] + 'y';
    ghosts.push(newGhost);
}

function createGame(){
    for(let i=0; i<g.ghostno; i++){
        createGhost();
    }
    gameBoard.forEach((cell)=>{
        createSquare(cell);
    })
    for(let i=0; i<g.size; i++){
        g.x += ` ${g.h}px `;
    }
    g.grid.style.gridTemplateColumns = g.x;
    g.grid.style.gridTemplateRows =  g.x;
    startPos();
}

function createSquare(val){
    const div = document.createElement('div');
    div.classList.add('box');
    if(val == 1){ div.classList.add('wall');}
    if(val == 2){ 
        const dot = document.createElement('div');
        dot.classList.add('dot');
        div.append(dot);
    }
    if(val == 3){ 
        const dot = document.createElement('div');
        dot.classList.add('powerpellet');
        div.append(dot);
    }
    g.grid.append(div);
    myBoard.push(div);
    div.t = val;
    div.idVal = myBoard.length;
}

///GHOST LOGIC
function findDir(a){
    let val = [a.pos % g.size , Math.ceil(a.pos/g.size)]; //col,row
    return val;
}

function changeDir(ene){
    let gg = findDir(ene);
    let pp = findDir(player);
    let ran = Math.floor(Math.random()*2);
    if(ran ==0 ){ ene.dx = (gg[0] < pp[0]) ? 2 : 3;} //hor
    else{ ene.dx = (gg[1] < pp[1]) ? 1 : 0;} //ver
    ene.counter = (Math.random()*10)+2;
}