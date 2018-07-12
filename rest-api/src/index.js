'use strict';
process.env['NODE_CONFIG_DIR'] = `${__dirname}/../config/`;

const HttpService = require('./services/http');
const express = require('express');
const config = require('config');
const cors = require('cors');

const logger = function() {
  console.log.apply(console, arguments);
}

const errorLogger = function() {
  console.error.apply(console, arguments);
}

const app = express();

const httpService = new HttpService();

const port = config.has('services.http.port') ? config.get('services.http.port') : 8080;

httpService.listen(app, port, (err) => {
  if (err) return;
  let apps = config.has('services.http.apps') ? config.get('services.http.apps') : {};
  app.use(cors());
  apps.forEach(appConfig => {
    var Service = require(`./apps/${appConfig.name}`);
    var service = new Service();
    service.on('log', logger);
    service.on('error', errorLogger);
    service.attachTo(app, appConfig);
  });
})

httpService.on('log', logger);
httpService.on('error', errorLogger);