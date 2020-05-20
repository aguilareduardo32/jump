var width = 360,
  height = 600,
  c = document.getElementById("c");
movespeed = 10;
frames = 0;
var myMusic;

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

//let gravity = 4;
//let gravityM = 4;

class Player {
  constructor(x, y, img, control) {
    this.x = x;
    this.y = y;
    this.xSpeed = 3.5;
    this.ySpeed = 0;
    this.img = new Image();
    this.img.onload = () => {
      this.ready = true;
    };
    this.img.src = img;
    this.ready = false;
    this.controls = control;
    this.height = 60;
    this.width = 60;
    this.isAlive = true;
    this.shoes = 3;
    this.gravity = 3;
  }

  drawItself(ctx) {
    if (this.controls.left) {
      this.moveLeft();
    }
    if (this.controls.right) {
      this.moveRight();
    }
    this.y += this.gravity;
    if (this.ready && this.isAlive) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  checkColission(platform) {
    if (
      this.y + this.height >= platform.y &&
      this.y < platform.y &&
      this.x > platform.x - 40 &&
      this.x + this.width < platform.x + platform.width + 40
    ) {
      
      return true;
      //  this.y = this.y - 190
    } else {
      return false;
    }
  }

  checkColissionFeet(element) {
    return (
      this.x + this.width >= element.x &&
      this.x <= element.x + element.width &&
      this.y + this.height - this.shoes <= element.y + element.height &&
      this.height + this.y >= element.y
    );
  }

  checkColissionBody(element) {
    return (
      this.x + this.width > element.x &&
      this.x < element.x + element.width &&
      this.y < element.y + element.height &&
      this.y + this.height - this.shoes > element.y
      // this.height - this.shoes < element.y + element.height
    );
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
let controlplayer1 = { left: false, right: false, up: false };
let player1 = new Player(
    c.width - 100,
    c.height - 400,
    "./img/rick.jpeg",
    controlplayer1
);

let controlplayer2 = { left: false, right: false, up: false };

let player2 = new Player(
    c.width - 100,
    c.height - 400,
    "./img/descarga.jpeg",
    controlplayer2
);
class Game {
  constructor(canvas, players) {
    this.ctx = canvas.getContext("2d");

    this.ctx.font = "24px Arial"
    this.ctx.fillStyle = "green"
    this.ctx.textBaseline = "top"
    this.ctx.textAlign = "right"
    this.width = canvas.width;
    this.height = canvas.height;
    this.platforms = [];
    this.bluePlatform = [];
    this.snd = new Audio("img/bounce.mp3");
    this.backSound = new Audio("img/rms.mp3");
    this.monsters = [];
    this.aliens = [];
    this.plasmas = [];
    this.canvas = canvas;
    this.players = players;
    this.img = new Image();
    this.img.src = "img/gamebackground.png";
    this.img.onload = () => {
      this.ready = true;
    };
    this.move = 0;
    this.moveAzul = 10;
    this.singlePlayer = players.length == 1;
    this.yLimit = 200;
    this.gravity = "";
    this.count = 0;
    this.maxScore = 7;
  }

  stop() {
    clearInterval(this.interval)
  }
  
  startGame() {
    clearInterval(this.interval)
      this.platforms =[];
      this.bluePlatform = [];
      this.monsters = [];
      this.aliens = [];
      this.plasmas = [];
      this.move = 0;
      this.gravity = "";
      myMusic = new Audio("img/rms.mp3");
      myMusic.play();
      this.count = 0;
      frames = 0;
    this.generatePlatform();

    this.interval = setInterval(() => {
      frames++;
      if (this.platforms[0]) {
        if (this.platforms[0].y >= c.height) {
          this.platforms.shift();
        }
      }
      let pos = Math.floor(Math.random() * (width - 80));

      if (frames % 3=== 0) {
        this.players.forEach(player => {
          if (player.gravity < 3) {
            player.gravity++;
          }
        });
        let newYPos = this.platforms[this.platforms.length - 1].y;
        let newYPosAzul = this.bluePlatform[this.bluePlatform.length - 1].y;
        this.platforms.push(
          new Plataform(pos, newYPos - 60, "./img/platform.png")
        );
        if (frames % 3== 0) {
            this.bluePlatform.push(
                new Plataform(pos, newYPosAzul - 600, "./img/11.png")
            );
        }
        if (frames % 9== 0) {
          this.monsters.push(
            new Monster(pos + 250, newYPos - 70 - 30, "./img/monster.png")
          );
        }

        if (frames % 30 == 0) {
          this.aliens.push(
            new Alien(pos + 100, newYPos - 60 - 50, "./img/alien1.jpeg")
          );
        }

        if (frames % 45 == 0) {
          this.plasmas.push(
            new Plasma(pos + 50, newYPos - 60 - 50, "./img/plasma.jpeg")
          );
        }
      }

        if( frames % 100 === 0 ){
            this.players.forEach(player => {
                if (player.gravity < 5) {
                  player.gravity++;
                }
            })
        }
        
    
      this.checkPlayers();
      this.clear();
      this.drawBackground();
      this.drawPlatforms();
      this.drawPlasmas();
      this.drawMonsters();
      this.drawAliens();
      this.drawPlayers();
      if (!this.singlePlayer) {
        if (!this.players[0].isAlive && !this.players[1].isAlive) {
          this.terminarJuego();
        }
      } else {
        if (!this.players[0].isAlive) {
          this.terminarJuego();
          myMusic.pause()
        }
      }
      this.drawScore();
      if(this.count >= this.maxScore){
          this.ganarJuego()
      }
    }, 1000/60);
  }
  drawScore(){          //TEXTO                                     X        Y
    this.ctx.fillStyle = "green"
    this.ctx.textBaseline = "top"
    this.ctx.textAlign = "right"
      this.ctx.fillText(this.count + '/' + this.maxScore, this.canvas.width, 0)
  }
  
  ganarJuego() {
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      this.ctx.fillStyle = "green"
    this.ctx.fillText("you won!!!!", this.width / 2, this.height / 2 )
    clearInterval(this.interval);
  }

  terminarJuego() {
    this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      this.ctx.fillStyle = "red"
    this.ctx.fillText("you lose!!!!", this.width / 2, this.height / 2 )
    clearInterval(this.interval);
  }

  generateSound() {
    if (
      this.y + this.height >= platform.y &&
      this.y < platform.y &&
      this.x > platform.x - 40 &&
      this.x + this.width < platform.x + platform.width + 40
    ) {
      this.snd.play();
    }
  }
  backSoundMus(){
     return this.backSound.play();
  }

  generatePlatform() {
    let positions = [50,190,330,400];
    positions.forEach( item => {
        this.platforms.push(
            new Plataform(
              Math.floor(Math.random() * (width - 50)),
              this.height - item,
              "./img/platform.png"
            )
        );
    })

    this.bluePlatform.push(
        new Plataform(Math.floor(Math.random() * (width - 80)),
        this.height - 50, "./img/gun2.jpeg")
    );
  }
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawBackground() {
    this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
  }
  backMusic() {

    return this.backSound.play()
  }

  drawPlayers() {
    this.players.forEach((player, indexP) => {
      this.platforms.forEach(platform => {
        if (player.checkColissionFeet(platform) && player.gravity > 0) {
          player.gravity = -8;
          this.snd.play();
        }
      });
      this.bluePlatform.forEach(platform => {
        if (player.checkColissionFeet(platform) && player.gravity > 0) {
          player.gravity = -10;
          this.snd.play();
        }
      });
      player.drawItself(this.ctx);
      this.monsters.forEach((monsterX, index) => {
        if (player.checkColissionBody(monsterX)) {
          // players.splice(indexP, 1)
          player.isAlive = false;
          //muere
        } else if (player.checkColissionFeet(monsterX) && player.gravity > 0) {
          //brinca
          player.gravity = -10;
          this.monsters.splice(index, 1);
        }
      });
      if (player.y < this.yLimit) {
        this.move = this.yLimit - player.y;
        player.y = this.yLimit;
      } //else {
      //this.move = 0;
      // }
      player.drawItself(this.ctx);
      this.aliens.forEach((alienX, index) => {
        if (player.checkColissionBody(alienX)) {
          // players.splice(indexP, 1)
          player.isAlive = false;
          //muere
        } else if (player.checkColissionFeet(alienX) && player.gravity > 0) {
          //brinca
          player.gravity = -10;
          this.aliens.splice(index, 1);
        }
      });
      if (player.y < this.yLimit) {
        this.move = this.yLimit - player.y;
        player.y = this.yLimit;
      }
      
        player.drawItself(this.ctx);
      
      this.plasmas.forEach((plasmaX, index) => {
        if (player.checkColissionBody(plasmaX) ) {

          this.plasmas.splice(index, 1);
          this.count ++;
          //aumentar 1/5 plasmas para ganar
        }
      });
    });
  }

  drawPlatforms() {
    this.platforms.forEach(platform => {
      platform.drawItself(this.ctx, this.move);
    });
    this.bluePlatform.forEach( bluePlatform  => {
      bluePlatform.drawAzul(this.ctx, this.moveAzul, this.move);
        // if(this.moveAzul< 340){
        //     this.moveAzul++
        // }
      });
  }
  drawMonsters() {
    this.monsters.forEach(monster => {
      monster.drawItself(this.ctx, this.move);
    });
  }

  drawAliens(){
    this.aliens.forEach(alien => {
      alien.drawItself(this.ctx, this.move);
    });

  }

  drawPlasmas() {
    this.plasmas.forEach(plasma => {
      plasma.drawItself(this.ctx, this.move);
    });
  }

  checkPlayers() {
    this.players.forEach((player, indexP) => {
      if (this.canvas.height < player.y + player.height) {
        player.isAlive = false;
      }
    });
  }

  //    // upScreen(c,player1,player2){
  //         if(c.height < player1.y+ player1.)
  //     }
}

class Plataform {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = new Image();
    this.img.onload = () => {
      this.ready = true;
    };
    this.img.src = img;
    this.ready = false;
    this.width = 80;
    this.height = 10;
    this.img.src = img;
    this.ready = false;
    this.width = 80;
    this.height = 10;
    this.reverseAzul = false;
}

  drawItself(ctx, move) {
    this.y = this.y + move;
    if (this.ready && this.y < height) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
  drawAzul(ctx, move, moveY) {
      move = move / 2
      this.y = this.y + moveY;
      if(this.reverseAzul){
          this.x = this.x - move
      }else {
        this.x = this.x + move;
      }
    if(this.x + this.width > width){
        this.reverseAzul = true;
    }
    if(this.x < 0){
        this.reverseAzul = false;
    }
    if (this.ready && this.y < height) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

}

 

class Monster {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = new Image();
    this.img.onload = () => {
      this.ready = true;
    };
    this.ready = false;
    this.img.src = img;
    this.width = 50;
    this.height = 50;
  }

  drawItself(ctx, move) {
    this.y = this.y + move;
    if (this.ready && this.y < height) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
}


class Alien {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = new Image();
    this.img.onload = () => {
      this.ready = true;
    };
    this.ready = false;
    this.img.src = img;
    this.width = 50;
    this.height = 50;
  }

  drawItself(ctx, move) {
    this.y = this.y + move;
    if (this.ready && this.y < height) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
}



class Plasma {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = new Image();
    this.img.onload = () => {
      this.ready = true;
    };
    this.ready = false;
    this.img.src = img;
    this.width = 50;
    this.height = 50;
  }

  drawItself(ctx, move) {
    this.y = this.y + move;
    if (this.ready && this.y < height) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
}
//let plataform1 = new Plataform(100,100,"./img/doodle.png" )

window.addEventListener("keydown", function(e) {
  if (e.keyCode === 65 && player1.isAlive) {
    player1.controls.left = true;
  }
  if (e.keyCode === 68 && player1.isAlive) {
    player1.controls.right = true;
  }
  if (e.keyCode === 37 && player2.isAlive) {
    player2.controls.left = true;
  }
  if (e.keyCode === 39 && player2.isAlive) {
    player2.controls.right = true;
  }
});

window.addEventListener("keyup", function(e) {
  if (e.keyCode === 65 && player1.isAlive) {
    player1.controls.left = false;
  }
  if (e.keyCode === 68 && player1.isAlive) {
    player1.controls.right = false;
  }
  if (e.keyCode === 37 && player2.isAlive) {
    player2.controls.left = false;
  }
  if (e.keyCode === 39 && player2.isAlive) {
    player2.controls.right = false;
  }
});
let game = undefined
document.querySelector("#singleplayer").onclick = event => {

    player1 = new Player(
        c.width - 100,
        c.height - 400,
        "./img/rick.jpeg",
        controlplayer1
    );
    if (game){
        game.stop();
    }
    game = new Game(c, [player1]);
    game.startGame();
};

document.querySelector("#multiplayer").onclick = event => {
    player1 = new Player(
        c.width - 100,
        c.height - 400,
        "./img/rick.jpeg",
        controlplayer1
    );
    player2 = new Player(
        c.width - 180,
        c.height - 400,
        "./img/descarga.jpeg",
        controlplayer2
    );
    
    if (game){
        game.stop();
    }
   game = new Game(c, [player1, player2]);
  game.startGame();
};
