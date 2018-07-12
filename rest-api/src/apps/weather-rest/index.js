'use strict';

const Service = require('../../services');

class WeatherRestService extends Service {
  get name () { return 'weather-rest'; }
  attachTo(app, config) {
    let versions = Array.isArray(config.versions) ? config.versions : [];
    let version = config.version || versions[0];
    if (!versions.indexOf(version) < 0) versions.push(version);

    app.use((req, res, next) => {
      req.ipV4 = (data => {
        if (req.query.ip) return req.query.ip;
        let address = data.address;
        if (data.family === 'IPv4') return address;
        if (data.family === 'IPv6' && address.split(':').length === 4) {
          address = address.split(':')[3];
          if (address === '1') address = '127.0.0.1';
          return address;
        }
      })(req.socket.address());
      req.serviceConfig = config;
      next();
    });

    if (version) app.use('/', require(`./${version}`)({}));
    versions.forEach(version => {
      app.use(`/${version}`, require(`./${version}`)({}));
    });

    app.use((err, req, res, next) => {
      if (!err) return next();
      res.status(err.status || 500);
      res.json({
        message: err.message
      });
    });
    this.log('attached');
  }
}

module.exports = WeatherRestService;