'use strict';

module.exports = class Reporter {
  constructor(type) {
    if (!type) {
      throw 'Type must be provided';
    }
    this.type = type;
  }

  checkForNotifications() {
    throw 'This must be implmented on the child class';
  }
};
