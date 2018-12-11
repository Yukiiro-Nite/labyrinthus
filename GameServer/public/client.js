var users = {};
var player = document.getElementById("player");
var scene = document.getElementById("scene");
const socket = scene.systems['networked-system'].socket;
var shroom = document.getElementById("shroom-el");

shroom.addEventListener('model-loaded', (event) => {
  console.log('Shroom model loaded!');
});

scene.object3D.fog = new THREE.FogExp2(0x000000, 0.15);

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

socket.on('update', (msg) => {
  console.log(`updating ${msg.id}`);
  const el = users[msg.id].element;
  msg.changes.forEach(change => el.setAttribute(change.attrName, change.attr));
});

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
