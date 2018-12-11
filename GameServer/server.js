const expressStarter = require('express-starter');
const { port } = require('./config');
const log = require('./utils/log');

expressStarter.start(port,
  (express, app, io) => {
    log(`Server started on port: ${port}`);
    app.use(express.static('public'));
  },
  (express, app, io) => {

  });