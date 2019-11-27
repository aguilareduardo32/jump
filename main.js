var width = 340,
	height = 550,
    c = document.getElementById('c');
    movespeed = 10;
    frames = 0;


	//ctx = c.getContext('2d'),
    //snd = new Audio("sound/bounce.mp3"),
    //morty = new Image(),
   // rick = new Image(),
   // plataform = new Image()

// morty.src = "./img/descarga.jpeg"
//rick.src = "./img/rick.jpeg"
//plataform.src = "./img/doodle.png"
c.width = width;
c.height = height;




let gravity = 4;





class Player{
    constructor(x, y, img, control){
        this.x = x;
        this.y = y;
        this.xSpeed = 7;
        this.ySpeed = 0;
        this.img = new Image();
        this.img.onload = ()=>{
            this.ready = true;
        } 
        this.img.src = img
        this.ready = false;
        this.controls = control
        this.height = 60;
        this.width = 60;
        this.isAlive = true;
        this.shoes = 3
    }

    drawItself(ctx){
        if (this.controls.left){
            this.moveLeft()
        }
        if (this.controls.right){
            this.moveRight()
        }
        this.y += gravity
        if (this.ready){
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height)

        }
        
    }
    
    checkColission(platform) {
        if (this.y + this.height >= platform.y && this.y < platform.y &&
            this.x > platform.x - 40 && this.x + this.width < platform.x + platform.width + 40
            ) {
                console.warn("choco")
                return true
          //  this.y = this.y - 190 
        } else {return false}
    }

    checkColissionFeet(element) {
        return (
            this.x+this.width >= element.x &&
            this.x <= element.x + element.width &&
            this.y + this.height - this.shoes <= element.y + element.height &&
            this.height + this.y >= element.y
        )
    }

    checkColissionBody(element) {
        return (
            this.x + this.width > element.x &&
            this.x < element.x + element.width &&
            this.y < element.y + element.height &&
            this.y + this.height - this.shoes > element.y
            // this.height - this.shoes < element.y + element.height
        )
    }

    

    moveLeft() {
        this.x -= this.xSpeed;
        if (this.x <= -this.width) {
            this.x = width;
        }
    }

    moveRight() {
        this.x += this.xSpeed;
        if (this.x >= width) {
            this.x = -this.width;
        }
    }
    

    
}
 let controlplayer1 = {left:false, right: false, up:false}
let player1 = new Player(c.width  -100 , c.height - 350, "./img/rick.jpeg", controlplayer1)

let controlplayer2 = {left:false, right: false, up:false}
let player2 = new Player(c.width - 200 , c.height - 350, "./img/descarga.jpeg", controlplayer2)

class Game{
    constructor(canvas, players){
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.platforms = [];
       this.snd = new Audio("img/bounce.mp3");
        this.monsters = [];
        this.canvas = canvas
        this.players = players;
        this.img = new Image();
        this.img.src = 'img/gamebackground.png'
        this.img.onload = ()=>{
            this.ready = true;
        }
        this.move = 0
        this.singlePlayer = players.length == 1
        this.yLimit = 120;
    }

    startGame(){
        this.generatePlatform();

        this.interval = setInterval(()=> { 
            frames++
            if(this.platforms[0]) {
                if (this.platforms[0].y>=c.height){
                    this.platforms.shift();
                }
                
            }
            let pos = Math.floor(Math.random()*(width - 80));
            if(frames % 5 === 0){
                if (gravity<4) {
                    gravity++;
                }
                let newYPos = this.platforms[this.platforms.length - 1].y;
                this.platforms.push(new Plataform(pos, newYPos - 60, "./img/platform.png"))
                if (frames % 30 == 0){
                    this.monsters.push(new Monster(pos +50, newYPos - 60 - 50, "./img/monster.png"))

                }
            }
            
            this.checkPlayers(this.canvas, player1, player2)
            this.clear()
            this.drawBackground()
            this.drawPlatforms()
            this.drawMonsters()
            this.drawPlayers()
            if (!this.singlePlayer){
                if(!player1.isAlive && !player2.isAlive) {
                    this.terminarJuego()
                }
                
            }else{
                if (!player1.isAlive){
                    this.terminarJuego()
                }

            }
            
        }, 16.6666);

    }

    terminarJuego() {
        //dibuaj pantalla de game over
        console.error('Game OVER')
        clearInterval(this.interval)
    }

   generateSound(){if (this.y + this.height >= platform.y && this.y < platform.y &&
        this.x > platform.x - 40 && this.x + this.width < platform.x + platform.width + 40
        ) {
        this.snd.play();
           }
    }
 


    generatePlatform(){
        this.platforms.push(new Plataform(Math.floor(Math.random()*(width - 80)), this.height-50, "./img/platform.png"))
        this.platforms.push(new Plataform(Math.floor(Math.random()*(width - 80)), this.height-120, "./img/platform.png"))
        this.platforms.push(new Plataform(Math.floor(Math.random()*(width - 80)), this.height-190, "./img/platform.png"))
        this.platforms.push(new Plataform(Math.floor(Math.random()*(width - 80)), this.height-260, "./img/platform.png"))
        this.platforms.push(new Plataform(Math.floor(Math.random()*(width - 80)), this.height-330, "./img/platform.png"))
        this.platforms.push(new Plataform(Math.floor(Math.random()*(width - 80)), this.height-400, "./img/platform.png"))
        this.platforms.push(new Plataform(Math.floor(Math.random()*(width - 80)), this.height-470, "./img/platform.png"))
    }
    clear(){
        this.ctx.clearRect(0, 0, this.width, this.height)
    }

    drawBackground() {
        this.ctx.drawImage(this.img, 0, 0, this.width, this.height)
    }

    drawPlayers(){
        this.players.forEach(player => {
            this.platforms.forEach(platform => {
                if(player.checkColissionFeet(platform) && gravity > 0 ){ 
                    gravity = -10;
                    this.snd.play();

                }
                
            })
            player.drawItself(this.ctx);
            this.monsters.forEach(((monsterX, index)=>{

                if(player.checkColissionBody(monsterX)){
                    player.isAlive = false
                    //muere
                } else if(player.checkColissionFeet(monsterX)){
                    //brinca
                    gravity = -10;
                    this.monsters.splice(index,1)
                }

            }))
            if (player.y < this.yLimit){
                this.move = this.yLimit - player.y 
                player.y = this.yLimit
            } else {
                this.move = 0;
            }
            
        })
    }

    drawPlatforms(){
        this.platforms.forEach(platform => {
            platform.drawItself(this.ctx, this.move);
        })
    }
    drawMonsters(){
        this.monsters.forEach(monster => {
            monster.drawItself(this.ctx, this.move);
        })
    }

    checkPlayers(c, player1, player2){
        if (c.height < player1.y + player1.height ){
            player1.isAlive = false 
        }
        if (c.height < player2.y + player2.height ){
            player2.isAlive = false
        }
    }

//    // upScreen(c,player1,player2){
//         if(c.height < player1.y+ player1.)
//     }

    
    
}

class Plataform{
    constructor(x, y, img) {
        this.x = x;
        this.y = y;
        this.img = new Image();
        this.img.onload = ()=>{
            this.ready = true;
        } 
        this.img.src = img
        this.ready = false;
        this.width = 80
        this.height = 10

    }
    
    drawItself(ctx, move){
        this.y = this.y+move;
        if (this.ready)  {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
       }
    }
    
}

class Monster{
    constructor(x,y,img){
        this.x = x;
        this.y = y;
        this.img = new Image();
        this.img.onload = ()=>{
            this.ready = true;
        } 
        this.ready = false;
        this.img.src = img
        this.width = 50
        this.height = 50
        
    }

    drawItself(ctx, move){
        this.y = this.y + move;
        if (this.ready) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
       }
    }

}

class Portal{
    constructor(x,y, img){
    this.x = x;
    this.y = y;
    this.Image
    this.img = new Image();
    this.img.onload = ()=>{
        this.ready = true;
    }
    this.ready = false;
    this.img.src = img
    this.width = 50
    this.height = 50

    }

   // drawItself(ctx, move){
  //      this.y = this.y + move;
   //     if (this.ready) {
   //         ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
   //    }
   // }
    

}
//let plataform1 = new Plataform(100,100,"./img/doodle.png" )



window.addEventListener("keydown", function(e) {
    if(e.keyCode ===  65 && player1.isAlive) {
        player1.controls.left  = true;
    }
    if(e.keyCode === 68 && player1.isAlive) {
        
        player1.controls.right = true;
    }
    if(e.keyCode ===  37 && player2.isAlive) {
        player2.controls.left  = true;
    }
    if(e.keyCode ===  39 && player2.isAlive) {
        player2.controls.right = true;
    }
    
});

window.addEventListener("keyup", function(e) {
    if(e.keyCode ===  65 && player1.isAlive) {
        player1.controls.left  = false;
    }
    if(e.keyCode === 68 && player1.isAlive) {
        
        player1.controls.right = false;
    }
    if(e.keyCode ===  37 && player2.isAlive) {
        player2.controls.left  = false;
    }
    if(e.keyCode ===  39 && player2.isAlive) {
        player2.controls.right = false;
    }
    
    
});



document.querySelector('#singleplayer').onclick = (event) => {
    let game = new Game(c, [player1])
    game.startGame()
    
}

document.querySelector('#multiplayer').onclick = (event) => {
let game = new Game(c, [player1, player2 ])
game.startGame()
}