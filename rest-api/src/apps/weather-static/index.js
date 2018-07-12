'use strict';

const Service = require('../../services');
const express = require('express');
const path = require('path');

class WeatherStaticService extends Service {
  get name () { return 'weather-static'; }
  attachTo(app, config) {
    let staticPath = path.join(__dirname, config.path);
    app.use('/', express.static(staticPath));
    this.log(`attached (${staticPath})`);
  }
}

module.exports = WeatherStaticService;