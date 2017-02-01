var grid;
var columns = 25;
var rows = 25;
var startNode;
var endNode;
var openSet = [];
var closedSet = [];
var w, h;
var cm = {};

function Spot (x, y) {
  this.x = x;
  this.y = y;
  this.f = 0;
  this.h = 0;
  this.g = 0;
  this.neighbors = [];
  this.parent = null;

  this.show = function (col) {
    fill(col);
    noStroke();
    rect(this.x * w, this.y * h, w - 1, h -1);
  }

  this.addNeighbors = function (grid) {
    var i = this.x;
    var j = this.y;

    if (i < columns - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }

    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }

    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }

    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
  }

  this.reconstructPath = function () {
    var path = [];
    var temp = this;

    path.push(temp);

    while (temp.parent) {
      path.push(temp.parent);
      temp = temp.parent;
    }

    return path;
  }
}

function findSpotWithLowestScoreF (set) {
  var index = 0;

  for (var i = 0; i < set.length; i++) {
    if (set[i].f < set[index].f) {
      index = i;
    }
  }

  return index;
}

function heuristicCostEstimate (a, b, h) {
  return h(a, b);
}

function euclideanDistance (a, b) {
  return dist(a.x, a.y, b.x, b.y);
}

function manhattanDistance (a, b) {
  return abs(a.x - b.x) + abs(a.y - b.y);
}

// Create a (columns X rows) Grid
function createGrid (cols, rows, filler) {
  var grid = [];

  for (var i = 0; i < cols; i++) {
    grid[i] = [];
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  return grid;
}

function showSpots (spots, color) {
  for (var i = 0; i < spots.length; i++) {
    spots[i].show(color);
  }
}

function showGrid (grid) {
  for (var i = 0; i < columns; i++) {
    showSpots(grid[i], color(255));
  }
}

function traverseNeighbors (current) {
  var neighbors = current.neighbors;

  for (var i = 0; i < neighbors.length; i++) {
    var neighbor = neighbors[i];

    if (closedSet.includes(neighbor)) {
      // Ignore the neighbor which is already evaluated.
      continue;
    }

    var tempG = current.g + 1;

    if (openSet.includes(neighbor)) {
      if (tempG < neighbor.g) {
        neighbor.g = tempG;
      }
    } else {
      neighbor.g = tempG;
      openSet.push(neighbor);
    }

    // This path is the best until now. Record it!
    neighbor.parent = current;
    neighbor.h = heuristicCostEstimate(neighbor, endNode, manhattanDistance);
    // f(n) = g(n) + h(n)
    neighbor.f = neighbor.g + neighbor.h;
  }
}

function setup () {
  createCanvas(400, 400);
  console.log('A*');

  w = width / columns;
  h = height / rows;

  // Color Map
  cm = {
    red   : color(255, 0, 0),
    green : color(0, 255, 0),
    blue  : color(0, 0, 255)
  };

  // Create a 2d array
  grid = createGrid(columns, rows);
  // console.log(grid)

  startNode = grid[0][0];
  endNode = grid[columns-1][rows-1];
  // For the first node, that value is completely heuristic
  startNode.h = heuristicCostEstimate(startNode, endNode, manhattanDistance);
  openSet.push(startNode);
}

function draw () {
  if (openSet.length > 0) {
    var currentIndex = findSpotWithLowestScoreF(openSet);
    var current = openSet[currentIndex];

    // console.log(current)
    if (current === endNode) {
      console.log("DONE!");
      noLoop();
    }
    // Remove the element from openSet by its index
    openSet.splice(currentIndex, 1);
    closedSet.push(current);
    // Traverse the current node neighbors
    traverseNeighbors(current);
  }

  background(0);
  showGrid(grid)

  var bestPath = current.reconstructPath();

  showSpots(closedSet, cm.red);
  showSpots(openSet, cm.green);
  showSpots(bestPath, cm.blue);
}
