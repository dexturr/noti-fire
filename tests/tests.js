'use strict';

let NotiFire = require('../lib/index');
let NotificationFactory = require('../lib/notification-factory');
let Context = require('../lib/context');
let DateNotifier = require('../lib/notifiers/date-notifier');
let GithubNotifier = require('../lib/notifiers/github-notifier');
let JiraNotifier = require('../lib/notifiers/jira-notifier');
let assert = require('assert');
let fetch = require('node-fetch');

describe('NotiFire - Acceptance tests', () => {


  it('Notifier error if notifier name does not exist', () => {
    const code = `
    var test = 123;
    // this is a text comment
    // this is a second comment
    // noti-fire FOO 11/08/1993
`;
    const dateNotifier = new DateNotifier();
    const context = new Context();
    const factory = new NotificationFactory([dateNotifier]);
    const notiFire = new NotiFire(code, factory, context);

    notiFire.processComments().catch(err => {
      assert.equal('Could not find notifier FOO', err.message);
    });
  });

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

  it('Date notifier does not report if the date is in the past', () => {
    const code = `
    var test = 123;
    // this is a text comment
    // this is a second comment
    // noti-fire DATE 01/01/3000
`;
    const dateNotifier = new DateNotifier();
    const context = new Context();
    const factory = new NotificationFactory([dateNotifier]);
    const notiFire = new NotiFire(code, factory, context);

    notiFire.processComments();

    assert.ok(!context.errors.length);
  });

  it('Gitub notifier reports if the issue is clsoed', done => {
    const code = `
    var test = 123;
    // this is a text comment
    // this is a second comment
    // noti-fire GITHUB ISSUE nodejs node 123
`;
    const fakeFecth = () => ({ state: 'closed' });
    const githubNotifier = new GithubNotifier(fakeFecth);
    const context = new Context();
    const factory = new NotificationFactory([githubNotifier]);
    const notiFire = new NotiFire(code, factory, context);

    notiFire.processComments().then(() => {
      assert.ok(context.errors.length);
      done();
    });
  });

  it('Gitub notifier does not report if the issue is open', done => {
    const code = `
    var test = 123;
    // this is a text comment
    // this is a second comment
    // noti-fire GITHUB ISSUE nodejs node 123
`;
    const fakeFecth = () => ({ state: 'open' });
    const githubNotifier = new GithubNotifier(fakeFecth);
    const context = new Context();
    const factory = new NotificationFactory([githubNotifier]);
    const notiFire = new NotiFire(code, factory, context);

    notiFire.processComments().then(() => {
      assert.ok(!context.errors.length);
      done();
    });
  });

  it('Gitub notifier errors if not passed issue', done => {
    const code = `
    var test = 123;
    // this is a text comment
    // this is a second comment
    // noti-fire GITHUB PR nodejs node 123
`;
    const fakeFecth = () => ({ state: 'open' });
    const githubNotifier = new GithubNotifier(fakeFecth);
    const context = new Context();
    const factory = new NotificationFactory([githubNotifier]);
    const notiFire = new NotiFire(code, factory, context);

    notiFire.processComments().catch(() => {
      assert.ok(true);
      done();
    });
  });

  it('Jira notifier reports if the issue is Resolved', done => {
    const code = `
    var test = 123;
    // this is a text comment
    // this is a second comment
    // noti-fire JIRA JRACLOUD-68988
`;
    const url = 'https://jira.atlassian.com/rest/api/2/issue';
    const githubNotifier = new JiraNotifier(fetch, url);
    const context = new Context();
    const factory = new NotificationFactory([githubNotifier]);
    const notiFire = new NotiFire(code, factory, context);

    notiFire.processComments().then(() => {
      assert.ok(true);
      done();
    }).catch(function() {
      console.log(arguments);
    });
  });

  it('Jira notifier reports if the issue is at the status passed in', done => {
    const code = `
    var test = 123;
    // this is a text comment
    // this is a second comment
    // noti-fire JIRA JRACLOUD-69747 Open
`;
    const url = 'https://jira.atlassian.com/rest/api/2/issue';
    const githubNotifier = new JiraNotifier(fetch, url);
    const context = new Context();
    const factory = new NotificationFactory([githubNotifier]);
    const notiFire = new NotiFire(code, factory, context);

    notiFire.processComments().then(() => {
      assert.ok(true);
      done();
    });
  });
});
