const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
const io = require('socket.io')(server);

const port = 3005;

server.listen(port, () => {
  console.log(`[Web] Server started on ${port}`)
});

app.use(express.static('public'));

let users = {};
let map;
getMap();

io.on('connection', function(socket) {
  const id = socket.id;
  const ip = socket.request.connection.remoteAddress;
  console.log(`[Socket] connection from ${id} @ ${ip}`);
  map && socket.emit('map', map);
  socket.emit('users',users);
  users[id] = {id:id};
  socket.broadcast.emit('userJoin',users[id]);

  socket.on('disconnect', function(){
    console.log(id + ' user disconnected');
    io.emit('userExit', {id:id});
    delete users[id];
  });

  socket.on('move', function(event){
    users[id].position = event.position;
    socket.broadcast.emit('move', {id:id,position:event.position});
  });

  socket.on('name', function(event){
    users[id].name = event.name;
    io.emit('name', {id:id,name:event.name});
  });

  socket.on('message', function(event){
    io.emit('message', {id:id,message:event.message});
  });

  socket.on('rotate',function(event){
    users[id].rotation = event.rotation;
    socket.broadcast.emit('rotate', {id:id,rotation:event.rotation});
  })
});

function getMap() {
    http.get('http://localhost:3000/maze?json=true&size=50', res => {
      const statusCode = res.statusCode;
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\n` +
          `Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error(`Invalid content-type.\n` +
          `Expected application/json but received ${contentType}`);
      }
      if (error) {
        console.log(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => rawData += chunk);
      res.on('end', () => {
        try {
          map = JSON.parse(rawData);
          io.emit('map', map);
        } catch (e) {
          console.log(e.message);
        }
      });
    });
}