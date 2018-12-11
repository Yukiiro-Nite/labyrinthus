const Path = require('path');
const request = require('request-promise');
const log = require('../utils/log');
const { mapSize } = require('../config');

const users = {};

const mapPromise = request({
  url: `http://localhost:3000/maze?json=true&size=${mapSize}`,
  json: true
});

exports.config = {
  routes: {
    get: {
      '/socket.io.js': (req, res) => {
        const path = Path.resolve(__dirname, '../node_modules/socket.io-client/dist/socket.io.js');
        res.sendFile(path);
      }
    }
  },
  socketEvents: {
    connection(io, socket) {
      const id = socket.id;
      log(`${id} connected`);

      mapPromise.then((map) => socket.emit('map', map));
      socket.emit('users', users);

      users[id] = {id};
      socket.broadcast.emit('userJoin', users[id]);
    },
    update(io, socket, msg) {
      const id = socket.id;
      msg.forEach((change) => users[id][change.attrName] = change.attr);
      socket.broadcast.emit('update', {id, changes: msg});
    },
    disconnect(io, socket) {
      const id = socket.id;
      log(`${id} disconnected`);
      io.emit('userExit', {id});
      delete users[id];
    }
  }
};