'use strict';

const express = require('express');
const memoizee = require('memoizee');
const fetch = require('node-fetch');
const config = require('config');
const memoizeeParams = {
  promise: true,
  maxAge: config.has('memoizee.maxAge') ? config.get('memoizee.maxAge') : 0,
  normalizer: (args) => JSON.stringify(args[0])
}


function resolveConfig (path, args) {
  return new Promise(resolve => {
    if (!config.has(path)) throw new Error(`no config for '${path}' found`);
    let value = eval(`\`${`${config.get(path)}`}\`` );
    return resolve(value);
  })
}

const getLocation = memoizee(function(address) {
  if (!address) return Promise.reject(new Error('invalid ip address'));
  return resolveConfig('providers.location', {
    address
  })
    .then(url => fetch(url))
    .then(ret => ret.json())
    .then(data => {
      if (data.status !== 'success') throw new Error(data.message);
      return data;
    })
}, memoizeeParams);

const getWeatherCurrent = memoizee(function(args) {
  return resolveConfig('providers.weatherCurrent', args)
    .then(url => fetch(url))
    .then(ret => ret.json())
}, memoizeeParams);

const getWeatherForecast = memoizee(function(args) {
  return resolveConfig('providers.weatherForecast', args)
    .then(url => fetch(url))
    .then(ret => ret.json())
  }, memoizeeParams);

const Builder = (args) => {
  let router = express.Router();

  router.get(`/current/:lat/:lon`, (req, res, next) => {
    return getWeatherCurrent({
      lat: req.params.lat,
      lon: req.params.lon,
      q: '',
    })
      .then(data => {
        res.json(data);
      })
      .catch(e => next(e));
  });

  router.get(`/current/:city([-$0-9a-zA-Z_!,%^&*\/]+)?`, (req, res, next) => {
    return new Promise(resolve => {
      if (req.params.city) return resolve({
        q: req.params.city,
        lat: '',
        lon: ''
      })
      return getLocation(req.ipV4)
        .then(location => resolve({
          q: '',
          lat: location.lat,
          lon: location.lon
        }))
    })
      .then(args => getWeatherCurrent(args))
      .then(data => {
        res.json(data);
      })
      .catch(e => next(e));
  });
  router.get(`/forecast/:lat/:lon`, (req, res, next) => {
    return getWeatherForecast({
      lat: req.params.lat,
      lon: req.params.lon,
      q: '',
    })
      .then(data => {
        res.json(data);
      })
      .catch(e => next(e));
  });
  router.get(`/forecast/:city([-$0-9a-zA-Z_!,%^&*\/]+)?`, (req, res, next) => {
    return new Promise(resolve => {
      if (req.params.city) return resolve({
        q: req.params.city,
        lat: '',
        lon: ''
      })
      return getLocation(req.ipV4)
        .then(location => resolve({
          q: '',
          lat: location.lat,
          lon: location.lon
        }))
    })
      .then(args => getWeatherForecast(args))
      .then(data => {
        res.json(data);
      })
      .catch(e => next(e));
  });
  router.get(`/location/:path([-0-9a-zA-Z_\/]+)?`, (req, res, next) => {
      return getLocation(req.ipV4)
      .then(data => {
        if (!req.params.path) return data;
        try {
          let value = eval(`data.${req.params.path.split('/').join('.')}`);
          if (value === undefined) throw new Error('undefined value');
          return value;
        } catch (e) {
          throw new Error(`invalid path (${req.params.path})`);
        }
      })
      .then(data => res.json(data))
      .catch(e => next(e));
  });

  return router;
}

module.exports = Builder