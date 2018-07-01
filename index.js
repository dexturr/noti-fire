'use strict';

let espree = require('espree');

module.exports = class NotiFire {

  constructor(code, factory, context) {
    if (!code) {
      throw 'Code must be provided';
    }

    if (!context) {
      throw 'Context must be provided';
    }

    if (!factory) {
      throw 'Factory must be provided';
    }

    this.context = context;
    this.factory = factory;
    this.ast = espree.parse(code, {
      // create a top-level comments array containing all comments
      comment: true,

      // Set to 3, 5 (default), 6, 7, 8, 9, or 10 to specify the version of ECMAScript syntax you want to use.
      // You can also set to 2015 (same as 6), 2016 (same as 7), 2017 (same as 8), 2018 (same as 9), or 2019 (same as 10) to use the year-based naming.
      ecmaVersion: 6,
    });
  }

  get comments() {
    return this.ast.comments.map(comment => comment.value.trim());
  }

  get notiFireComments() {
    return this.comments.filter(comment => comment.startsWith('noti-fire'));
  }

  // TODO DO NOT DO THESE IN SEQUENC£
  async processComments() {
    for (const comment of this.notiFireComments) {
      const [, type, ...commentArguments] = comment.split(' ');
      const notificationProvider = this.factory.getImplementation(type);
      await notificationProvider.checkForNotifications(this.context, commentArguments);
    }
  }
};
