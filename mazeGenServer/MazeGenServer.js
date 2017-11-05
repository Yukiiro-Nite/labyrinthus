var express = require('express');
var app = express();
var port = 3000;
var mapSize = 50;

app.get('/maze', function (req, res) {
  console.log("Generating a maze!");
  res.send(generateMaze(req.query));
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.listen(port, function () {
  console.log('Maze Generator listening on port: ', port);
});

function generateMaze(options) {
  mapSize = options.size || mapSize;

  var blocks = [];
  for (var rows = 0; rows < mapSize; rows++) {
    blocks.push(new Array(mapSize));
    for (var part = 0; part < mapSize; part++) {
      blocks[rows][part] = true;
    }
  }
  var startX = Math.floor(Math.random() * mapSize);
  var startY = Math.floor(Math.random() * mapSize);

  var inMaze = new set();
  inMaze.add({x: startX, y: startY}, false);
  blocks[startX][startY] = false;

  while (inMaze.length > 0) {
    var currentTile = inMaze.objList()[inMaze.length - 1];
    var neighbors = getNeighbors(currentTile, blocks);
    if (neighbors.length > 0) {
      var tileToAdd = neighbors[Math.floor(Math.random() * neighbors.length)];
      inMaze.add({x: tileToAdd.x, y: tileToAdd.y}, false);
      blocks[tileToAdd.x][tileToAdd.y] = false;
    }
    else {
      var adjacent = getAdjacent(currentTile, blocks);
      if (!isPath(currentTile, blocks) && adjacent.length > 0) {
        var adjacentToConnect = adjacent[Math.floor(Math.random() * adjacent.length)]
        blocks[adjacentToConnect.x][adjacentToConnect.y] = false;
      }
      inMaze.remove(currentTile);
    }
  }

  blocks[startX][startY] = "#ee0000";

  for (var Y = 0; Y < blocks[0].length; Y++) {
    for (var X = 0; X < blocks.length; X++) {
      if (!isPath({x: X, y: Y}, blocks) && !blocks[X][Y]) {
        blocks[X][Y] = "#00ee00";
      }
    }
  }
  if(options.json){
    return pretty(blocks);
  } else {
    return objectify(blocks);
  }
}

function pretty(maze){
  let size = maze.length;
  for(let i=0; i < size; i++){
    maze[0][i] = true;
    maze[i][0] = true;
    maze[size-1][i] = true;
    maze[i][size-1] = true;
  }
  return maze
    .map((row, y) =>
      row.map((tile, x) =>
        ({x,y,wall:tile === true,start: tile === '#ee0000'})
      )
    );
}

function objectify(blocks) {
  var walls = [];
  for (var Y = 0; Y < blocks[0].length; Y++) {
    for (var X = 0; X < blocks.length; X++) {
      if (blocks[X][Y] === true) {
        walls.push(JSON.stringify({x: X, z: Y}));
      }
    }
  }
  return walls;
};

function set() {
  this.setList = {},
    this.length = 0,
    this.add = function (obj, data) {
      this.setList[JSON.stringify(obj)] = data;
      this.length++;
    },

    this.remove = function (obj) {
      delete(this.setList[JSON.stringify(obj)]);
      this.length--;
    },

    this.has = function (obj) {
      if (this.setList[JSON.stringify(obj)] === undefined) {
        return false;
      }
      else {
        return true;
      }
    },

    this.getData = function (obj) {
      return this.setList[JSON.stringify(obj)];
    },

    this.objList = function () {
      var keyList = [];
      for (var objKey in this.setList) {
        keyList.push(JSON.parse(objKey));
      }
      return keyList;
    }
};

function getNeighbors(t, blocks) {
  var neighbors = [];
  //check up, [{x,y-1},{x-1,y-1},{x,y-2},{x+1,y-1}]
  try {
    if (blocks[t.x][t.y - 1] && blocks[t.x - 1][t.y - 1] && blocks[t.x][t.y - 2] && blocks[t.x + 1][t.y - 1]) {
      neighbors.push({x: t.x, y: t.y - 1});
    }
  }
  catch (e) {
  }
  //check right, [{x+1,y},{x+1,y-1},{x+2,y},{x+1,y+1}]
  try {
    if (blocks[t.x + 1][t.y] && blocks[t.x + 1][t.y - 1] && blocks[t.x + 2][t.y] && blocks[t.x + 1][t.y + 1]) {
      neighbors.push({x: t.x + 1, y: t.y});
    }
  }
  catch (e) {
  }
  //check down, [{x,y+1},{x+1,y+1},{x,y+2},{x-1,y+1}]
  try {
    if (blocks[t.x][t.y + 1] && blocks[t.x + 1][t.y + 1] && blocks[t.x][t.y + 2] && blocks[t.x - 1][t.y + 1]) {
      neighbors.push({x: t.x, y: t.y + 1});
    }
  }
  catch (e) {
  }
  //check left, [{x-1,y},{x-1,y+1},{x-2,y},{x-1,y-1}]
  try {
    if (blocks[t.x - 1][t.y] && blocks[t.x - 1][t.y + 1] && blocks[t.x - 2][t.y] && blocks[t.x - 1][t.y - 1]) {
      neighbors.push({x: t.x - 1, y: t.y});
    }
  }
  catch (e) {
  }

  return neighbors;
}
function isPath(t, blocks) {
  var branchCount = 0;
  try {
    if (!blocks[t.x][t.y - 1]) {
      branchCount++;
    }
  }
  catch (e) {
  }
  //check right, [{x+1,y},{x+1,y-1},{x+2,y},{x+1,y+1}]
  try {
    if (!blocks[t.x + 1][t.y]) {
      branchCount++;
    }
  }
  catch (e) {
  }
  //check down, [{x,y+1},{x+1,y+1},{x,y+2},{x-1,y+1}]
  try {
    if (!blocks[t.x][t.y + 1]) {
      branchCount++;
    }
  }
  catch (e) {
  }
  //check left, [{x-1,y},{x-1,y+1},{x-2,y},{x-1,y-1}]
  try {
    if (!blocks[t.x - 1][t.y]) {
      branchCount++;
    }
  }
  catch (e) {
  }
  return !(branchCount === 1);
}
function getAdjacent(t, blocks) {
  var neighbors = [];
  //check up, [{x,y-1},{x-1,y-1},{x,y-2},{x+1,y-1}]
  try {
    if (blocks[t.x][t.y - 1]) {
      neighbors.push({x: t.x, y: t.y - 1});
    }
  }
  catch (e) {
  }
  //check right, [{x+1,y},{x+1,y-1},{x+2,y},{x+1,y+1}]
  try {
    if (blocks[t.x + 1][t.y]) {
      neighbors.push({x: t.x + 1, y: t.y});
    }
  }
  catch (e) {
  }
  //check down, [{x,y+1},{x+1,y+1},{x,y+2},{x-1,y+1}]
  try {
    if (blocks[t.x][t.y + 1]) {
      neighbors.push({x: t.x, y: t.y + 1});
    }
  }
  catch (e) {
  }
  //check left, [{x-1,y},{x-1,y+1},{x-2,y},{x-1,y-1}]
  try {
    if (blocks[t.x - 1][t.y]) {
      neighbors.push({x: t.x - 1, y: t.y});
    }
  }
  catch (e) {
  }

  return neighbors;
}