'use strict';

let espree = require('espree');

module.exports = class NotiFire {

  constructor(code, factory, context, options) {
    const ecmaVersion = (options && options.ecmaVersion) || 5;
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
      ecmaVersion,
    });
  }

  get comments() {
    return this.ast.comments.map(comment => comment.value.trim());
  }

  get notiFireComments() {
    return this.comments.filter(comment => comment.startsWith('noti-fire'));
  }

  async processComments() {
    const commentsPromiseArray = this.notiFireComments.map(this.processComment.bind(this));
    return await Promise.all(commentsPromiseArray);
  }

  processComment(comment) {
    const [, type, ...commentArguments] = comment.split(' ');
    const notificationProvider = this.factory.getImplementation(type);
    if (!notificationProvider) {
      throw new Error(`Could not find notifier ${type}`);
    }
    return notificationProvider.checkForNotifications(this.context, commentArguments);
  }

};
