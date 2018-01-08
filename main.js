// Define ball count paragraph

var para = document.querySelector('p');
var count = 0;

// Setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// Function to generate random number in the range

function random(min, max) {
  var num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// Define general shape constructor 

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists; // boolean
}

// Define ball constructor inheriting from Shape

function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists);
  
  this.color = color;
  this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

// Method to draw a ball instance 

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

// Updates to position and velocity of a ball instance

Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}

// Collision detection of balls

Ball.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
      }
    }
  }
}

// define EvilCircle constructor, inheriting from Shape

function EvilCircle(x, y, exists) {
    Shape.call(this, x, y, exists);
    
    this.color = 'white';
    this.size = 10;
    this.velX = 20;
    this.velY = 20;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

// Method to draw the Evil Circle

EvilCircle.prototype.draw = function() {
  ctx.beginPath(); // state a desire to draw
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 3;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke(); // draw 
}

// Define EvilCircle method to check bounds for the movement

EvilCircle.prototype.checkBounds = function() {
  if((this.x + this.size) >= width) {
    this.x -= this.size;
  }

  if((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if((this.y - this.size) <= 0) {
    this.y += this.size;
  } 
}

// Define EvilCircle controls method

EvilCircle.prototype.setControls = function() {
  var _this = this;
  window.onkeydown = function(e) {
    if(e.keyCode === 65) { // a key -> left
      _this.x -= _this.velX;
    } else if(e.keyCode === 68) { // d key -> rigth
      _this.x += _this.velX; 
    } else if(e.keyCode === 87) { // w key -> upwards
      _this.y -= _this.velY;
    } else if(e.keyCode === 83) { // s key -> downwards
      _this.y += _this.velY;
    }
  };
}

// Define EvilCircle collision detection with balls

EvilCircle.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (balls[j].exists) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        count--;
        para.textContent = 'Ball count: ' + count;
      }
    }
  }
}

// Array to store the balls

var balls = [];

// Define the EvilCircle which will eat balls

var evil = new EvilCircle(random(0,width), random(0,height), true);
evil.setControls();

// Animation loop

function loop() {
  // background refresh
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, width, height);

  while (balls.length < 50) {
    var ball = new Ball(
      random(0,width),
      random(0,height),
      random(-7,7),
      random(-7,7),
      true,
      'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
      random(10,20)
    );
    balls.push(ball);
    count++;
    para.textContent = 'Ball count: ' + count;
  }
  
    
  // Draw ball instances
  for (var i = 0; i < balls.length; i++) {
    if (balls[i].exists){
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect(); 
    }
  }
  
  // Draw the EvilCircle instance
  evil.draw();
  evil.checkBounds();
  evil.collisionDetect();
  
  // Calls loop() recursively to create a smooth animation     
  requestAnimationFrame(loop);
}

// start the animation

loop();

