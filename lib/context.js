'use strict';

module.exports = class Context {

  constructor() {
    this.errors = [];
  }

  report(error) {
    this.errors.push(error);
  }
};
