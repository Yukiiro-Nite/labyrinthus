var socket = io('http://yukiironite.me:3005');
var users = {};
var player = document.getElementById("player");
var scene = document.getElementById("scene");
var shroom = document.getElementById("shroom-el");

shroom.addEventListener('model-loaded', (event) => {
  console.log('Shroom model loaded!');
});

scene.object3D.fog = new THREE.FogExp2(0x000000, 0.15);

var playerData = {};

let world;

socket.on('map', function(map) {
  console.log("Got world!");
  world = createWorld(map);
});

socket.on('users', function(data){
  users = data;
  Object.keys(users).forEach(function(key){
    console.log("looping through id: ", key);
    users[key].element = createPlayer(users[key]);
    scene.appendChild(users[key].element);
  });
  console.log("got users!");
});

socket.on('userJoin', function(user){
  users[user.id] = user;
  users[user.id].element = createPlayer(user);
  scene.appendChild(users[user.id].element);
  console.log(users[user.id].name || user.id + " joined!");
});

socket.on('userExit', function(data){
  console.log(users[data.id].name || data.id + " disconnected!");
  scene.removeChild(users[data.id].element);
  delete users[data.id];
});

socket.on('move', function(event) {
  console.log('user move', event.position);
  users[event.id].element.setAttribute("position", event.position);
});

socket.on('rotate', function(event){
  users[event.id].element.setAttribute("rotation", event.rotation);
});

player.addEventListener('componentchanged', function(event){
  switch(event.detail.name){
    case 'position':
      if(xyzChanged(event.detail, "position")) {
        updatePosition(event.detail.target.getAttribute('position'));
      }
      break;
    case 'rotation':
      if(xyzChanged(event.detail, "rotation")) {
        updateRotation(event.detail.target.getAttribute('rotation'));
      }
      break;
  }
});

var updatePosition = function(position){
  // console.log('updating position');
  socket.emit('move', {position:position});
};

var xyzChanged = function(event, type){
  if(playerData[type] == undefined){
    playerData[type] = {
      oldX: 0,
      oldY: 0,
      oldZ: 0
    }
  }
  const data = event.target.getAttribute(type);
  //check if it's over the threshold of the old data
  if (Math.abs(playerData[type].oldX - data.x) > 0.01 ||
    Math.abs(playerData[type].oldY - data.y) > 0.01 ||
    Math.abs(playerData[type].oldZ - data.z) > 0.01) {
    //if it is, update the old player data and return true
    playerData[type].oldX = data.x;
    playerData[type].oldY = data.y;
    playerData[type].oldZ = data.z;
    return true;
  }
  return false;
};

var updateRotation = function(rotation){
  socket.emit('rotate',{rotation:rotation});
};

var createPlayer = function(user){
  var newPlayer = document.createElement("a-box");
  newPlayer.setAttribute('id', user.id);
  newPlayer.setAttribute('position', user.position || {x:0,y:0,z:0});
  newPlayer.setAttribute('rotation', user.rotation || {x:0,y:0,z:0});
  newPlayer.setAttribute('material', {color: '#ff7700'});
  // newPlayer.setAttribute('static-body', "true");
  // newPlayer.setAttribute('height', 4);
  return newPlayer;
};

function createWorld(mapData) {
  return {
    height: mapData.length,
    width: mapData[0].length,
    map: mapData.map( (row, y) => row.map( (tile, x) => createTile(x, y, tile) ))
  }
}

function createTile(x, y, tile) {
  if (tile.isStart) {
    console.log('Found start: ', x, y);
    player.setAttribute('position', {x: x * 4, y: 1.764, z: y * 4});
    shroom.setAttribute('position', {x: x * 4, y: 0, z: y * 4});
  } else if (tile.wall) {
    let newTile = document.createElement("a-box");
    newTile.setAttribute('id', `x:${x},y:${y}`);
    newTile.setAttribute('mixin', 'rock');
    newTile.setAttribute('position', {x: x * 4, y: 2, z: y * 4});
    newTile.setAttribute('height', 4);
    newTile.setAttribute('width', 4);
    newTile.setAttribute('depth', 4);
    scene.appendChild(newTile);
    tile.el = newTile;
  }
  return tile;
}
