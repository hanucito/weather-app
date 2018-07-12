'use strict';

const Service = require('./index');
const clc = require('cli-color');

class HttpService extends Service {
  get name () { return 'http'; }
  listen(app, port, callback) {
    var server = require('http').createServer(app)
    server.listen(port, () => {
      this.log(`Listening on ${clc.green(port)}`)
      callback(null, server)
    });
  }
}

module.exports = HttpService;