<script>
	let margin = 86;
	let flock;
  
function setup() {
	var parent = document.getElementById('BG');
	var canvas = createCanvas(windowWidth-margin, windowHeight-margin);
  flock = new Flock();
  for (let i = 0; i < 30; i++) {
    let b = new Boid(width / 0,height / 3);
    flock.addBoid(b);
  }
	canvas.parent('BG');
}

function draw() {
  background(255,249,236);
  flock.run();
}
function mouseDragged() {
  flock.addBoid(new Boid(mouseX, mouseY));
}
function Flock() {
  this.boids = [];
}

Flock.prototype.run = function() {
  for (let i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids);
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}
function Boid(x, y) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(random(-1, 1), random(-1, 1));
  this.position = createVector(x, y);
  this.r = 3.0;
  this.maxspeed = 2;
  this.maxforce = 0.07;
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
}

Boid.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}
Boid.prototype.flock = function(boids) {
  let sep = this.separate(boids);
  let ali = this.align(boids);
  let coh = this.cohesion(boids);
  sep.mult(1.5);
  ali.mult(1.0);
  coh.mult(1.0);
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}
Boid.prototype.update = function() {
  this.velocity.add(this.acceleration);
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  this.acceleration.mult(0);
}
Boid.prototype.seek = function(target) {
  let desired = p5.Vector.sub(target,this.position);
  desired.normalize();
  desired.mult(this.maxspeed);
  let steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);
  return steer;
}

Boid.prototype.render = function() {
  let theta = this.velocity.heading();
  fill(12,83,147);
  push();
  translate(this.position.x, this.position.y);
  noStroke();
  ellipse(1, 1, 7, 7);
  beginShape();
  pop();
}
Boid.prototype.borders = function() {
  if (this.position.x < -this.r)  this.position.x = width + this.r;
  if (this.position.y < -this.r)  this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
}
Boid.prototype.separate = function(boids) {
  let desiredseparation = 25.0;
  let steer = createVector(0, 0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < desiredseparation)) {
      let diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d);
      steer.add(diff);
      count++;
    }
  }
  if (count > 0) {
    steer.div(count);
  }
  if (steer.mag() > 0) {
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}
Boid.prototype.align = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0,0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    let steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}
Boid.prototype.cohesion = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0, 0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);
  } else {
    return createVector(0, 0);
  }
}

function windowResized() {
  resizeCanvas(windowWidth-margin, windowHeight-margin);
}
</script>