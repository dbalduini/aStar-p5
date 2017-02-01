
var WIDTH = 600;
var HEIGHT = 400;
var tree = [];
var center;
var ANGLE;

function Branch (begin, end) {
  this.begin = begin;
  this.end = end;

  this.show = function () {
    stroke(255);
    line(this.begin.x, this.begin.y, this.end.x, this.end.y);
  };

  this.split = function (angle) {
    var direction = p5.Vector.sub(this.end, this.begin);
    direction.rotate(angle);
    direction.mult(0.67);
    var newEnd = p5.Vector.add(this.end, direction);
    return new Branch(this.end, newEnd);
  }

  this.left = function () {
    return this.split(ANGLE);
  };

  this.right = function () {
    return this.split(-ANGLE)
  };
}

function pushFractals () {
  for (var i = tree.length-1; i >= 0; i--) {
    if (!tree[i].finished) {
      tree.push(tree[i].left());
      tree.push(tree[i].right());
    }
    tree[i].finished = true;
  }
}

function startTree() {
  // ANGLE = PI / 4;
  var degree = random(0, 360);
  ANGLE = radians(degree);
  console.log(degree, ANGLE)

  var begin = createVector(width / 2, height);
  var end = createVector(width / 2, height - 100);
  var root = new Branch(begin, end);

  tree.push(root);
}

function setup () {
  createCanvas(600, 400);
  frameRate(10); // FPS
  startTree();
}

function draw () {
  background(51);

  if (tree.length > 10000) {
    tree = [];
    startTree();
  }

  pushFractals();

  tree.forEach((branch) => {
    branch.show();
  });
}
