const request = require('supertest');
const should = require('should');
const express = require('express');

const WeatherService = require('../src/apps/weather-rest');

describe('Weather API', function() {
  let app = new express();
  let service = new WeatherService({});
  service.attachTo(app, {
    version: 'v1'
  });
  let agent = request.agent(app);
  let mockupAddress = '172.217.15.100'; // Google
  let mockupCity = 'London, UK';
  let cacheTimeout = 10; // low timeout to test memoized response

  it('GET location (as Google)', function(done) {
    agent
    .get(`/v1/location?ip=${mockupAddress}`)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => response.body)
    .then(body => {
      should.exist(body.city);
      should.exist(body.lat);
      should.exist(body.lon);
      done();
    })
  });

  it('GET current weather (as Google)', function(done) {
    agent
    .get(`/v1/current?ip=${mockupAddress}`)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => response.body)
    .then(body => {
      should.exist(body.weather);
      done();
    })
  });

  it('GET forecast weather (as Google)', function(done) {
    agent
    .get(`/v1/forecast?ip=${mockupAddress}`)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => response.body)
    .then(body => {
      should.exist(body.city);
      should(body.list).be.instanceof(Array);
      done();
    })
  });

  it(`GET current weather (${mockupCity})`, function(done) {
    agent
    .get(`/v1/current/${mockupCity}`)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => response.body)
    .then(body => {
      should(body.name).be.exactly('London');
      should.exist(body.weather);
      done();
    })
  });

  it(`GET forecast weather (${mockupCity})`, function(done) {
    agent
    .get(`/v1/forecast/${mockupCity}`)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => response.body)
    .then(body => {
      should(body.city.name).be.exactly('London');
      should(body.list).be.instanceof(Array);
      done();
    })
  });

  it(`GET forecast weather (${mockupCity}) [Cached]`, function(done) {
    agent
    .get(`/v1/forecast/${mockupCity}`)
    .expect('Content-Type', /json/)
    .expect(200)
    .timeout(cacheTimeout)
    .then(response => response.body)
    .then(body => {
      should(body.city.name).be.exactly('London');
      should(body.list).be.instanceof(Array);
      done();
    })
  });
});
