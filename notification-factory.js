'use strict';

module.exports = class NotificationFactory {
  constructor(implementations) {
    this.implementations = implementations;
  }

  getImplementation(type) {
    return this.implementations.find(implementation => implementation.type === type);
  }
};
