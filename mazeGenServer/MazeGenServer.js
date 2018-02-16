const express = require('express');
const app = express();
const port = 3000;
const mapSize = 50;

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

function Map(size) {
  this.startX = Math.floor(Math.random() * size);
  this.startY = Math.floor(Math.random() * size);
  const data = new Array(size).fill().map((_, y) => new Array(size).fill().map((_, x) => {
    return createTile(
      x,
      y,
      x === this.startX && y === this.startY
    )
  }));

  function createTile(x, y, isStart) {
    return {
      x,
      y,
      isStart,
      wall: true
    }
  }

  function isBreakable(src, dst) {
    let xOffset = dst.x - src.x;
    let yOffset = dst.y - src.y;
    let xSideset = xOffset === 0 ? 1 : 0;
    let ySideset = yOffset === 0 ? 1 : 0;
    return [
      getTile(dst.x, dst.y),
      getTile(dst.x+xOffset, dst.y+yOffset),
      getTile(dst.x+xSideset, dst.y+ySideset),
      getTile(dst.x-xSideset, dst.y-ySideset)
    ].every(tile => tile && tile.wall)
  }

  function open(x, y) {
    try {
      data[y][x].wall = false;
    } catch(e) {}
  }

  function getTile(x, y) {
    try {
      return data[y][x];
    } catch (e) {}
  }

  function getStart() {
    return getTile(this.startX, this.startY);
  }

  function getNeighbors(tile) {
    return [
      getTile(tile.x, tile.y-1),
      getTile(tile.x+1, tile.y),
      getTile(tile.x, tile.y+1),
      getTile(tile.x-1, tile.y)
    ].filter(tile => tile);
  }

  function getWalls(tile) {
    return getNeighbors(tile).filter(neighbor => isBreakable(tile, neighbor));
  }

  function getData() {
    return data;
  }

  function pathValue(tile) {
    return getNeighbors(tile).filter(tile => !tile.wall).length;
  }

  function getAdjacentPaths(tile) {
    return getNeighbors(tile)
      .filter(tile => tile.wall)
      .filter(tile => pathValue(tile) > 1);
  }

  this.open = open;
  this.getTile = getTile;
  this.getStart = getStart;
  this.getNeighbors = getNeighbors;
  this.getWalls = getWalls;
  this.getData = getData;
  this.pathValue = pathValue;
  this.getAdjacentPaths = getAdjacentPaths;
}

function generateMaze({ size=mapSize }) {
  const map = new Map(parseInt(size));
  map.open(map.startX, map.startY);

  const inMaze = [ map.getStart() ];
  let currentTile, walls, tileToAdd, adjacentPaths;

  while( inMaze.length > 0 ) {
    currentTile = inMaze.pop();
    walls = map.getWalls(currentTile);
    if(walls.length > 0) {
      tileToAdd = walls[Math.floor(Math.random() * walls.length)];
      map.open(tileToAdd.x, tileToAdd.y);
      inMaze.push(currentTile);
      inMaze.push(tileToAdd);
    } else if(map.pathValue(currentTile) === 1) {
      adjacentPaths = map.getAdjacentPaths(currentTile);
      if(adjacentPaths.length > 0) {
        tileToAdd = adjacentPaths[Math.floor(Math.random() * adjacentPaths.length)];
        map.open(tileToAdd.x, tileToAdd.y);
      }
    }
  }

  return map.getData();
}
