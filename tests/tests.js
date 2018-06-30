'use strict';

let NotiFire = require('../index');
let NotificationFactory = require('../notification-factory');
let Context = require('../context');
let DateNotifier = require('../notifiers/date-notifier');
let assert = require('assert');

const code = `
    var test = 123;
    // this is a text comment
    // this is a second comment
    // noti-fire DATE 11/08/1993
`;

describe('NotiFire', () => {
  it('Should generate an array of comments', () => {
    const dateNotifier = new DateNotifier('DATE');
    const context = new Context();
    const factory = new NotificationFactory([dateNotifier]);
    const notiFire = new NotiFire(code, factory, context, [DateNotifier]);

    notiFire.processComments();

    assert.ok(context.errors.length);
  });

  it('Should generate an array of comments', () => {
    const notiFire = new NotiFire(code);
    let { notiFireComments } = notiFire;
  });
});
