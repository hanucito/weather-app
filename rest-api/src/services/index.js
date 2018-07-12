'use strict';

const EventEmitter = require('events');
const clc = require('cli-color');

class Service {
  constructor() {
    this._emitter = new EventEmitter();
  }
  on() {
    this._emitter.on.apply(this, arguments);
  }
  once() {
    this._emitter.once.apply(this, arguments);
  }
  off() {
    this._emitter.off.apply(this, arguments);
  }
  emit() {
    this._emitter.emit.apply(this, arguments);
  }
  error(error) {
    var msg = `${clc.red('[')} ${this.name} ${clc.red(']')} ${error.message}`;
    this._emitter.emit.call(this, 'error', msg);
  }
  log(body) {
    var msg = `${clc.green('[')} ${this.name} ${clc.green(']')} ${body}`;
    this._emitter.emit.call(this, 'log', msg);
  }
}

module.exports = Service;