'use strict';

let NotiFire = require('../index');
let NotificationFactory = require('../notification-factory');
let Context = require('../context');
let DateNotifier = require('../notifiers/date-notifier');
let GithubNotifier = require('../notifiers/github-notifier');
let assert = require('assert');

describe('NotiFire - Acceptance tests', () => {

  it('Date notifier reports if the date is in the past', () => {
    const code = `
    var test = 123;
    // this is a text comment
    // this is a second comment
    // noti-fire DATE 11/08/1993
`;
    const dateNotifier = new DateNotifier();
    const context = new Context();
    const factory = new NotificationFactory([dateNotifier]);
    const notiFire = new NotiFire(code, factory, context);

    notiFire.processComments();

    assert.ok(context.errors.length);
  });

  it('Gitub notifier reports if the date is in the past', done => {
    const code = `
    var test = 123;
    // this is a text comment
    // this is a second comment
    // noti-fire GITHUB ISSUE nodejs node 123
`;
    const fakeFecth = () => ({ json: () => ({ state: 'closed' }) });
    const githubNotifier = new GithubNotifier(fakeFecth);
    const context = new Context();
    const factory = new NotificationFactory([githubNotifier]);
    const notiFire = new NotiFire(code, factory, context);

    notiFire.processComments().then(() => {
      assert.ok(context.errors.length);
      done();
    });
  });
});
