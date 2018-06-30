'use strict';

let Reporter = require('./base-notifier');
const fetch = require('node-fetch');

module.exports = class GithubReporter extends Reporter {

  constructor() {
    super('GITHUB');
  }

  getData(url) {
    return fetch(url)
      .then(res => res.json());
  }

  proccessIssue(response, notifyState, context) {
    const { state } = response;
    console.log(state);
    if (state === notifyState) {
      context.report({
        message: `Github issue is now ${state}, this can now be reviewed`,
      });
    }
  }

  checkForNotifications(context, [target, org, repo, number, state = 'resolved']) {
    if (target !== 'ISSUE') {
      throw `${target} is not currently supported. Only issues are currently supported`;
    }
    const url = `https://api.github.com/repos/${org}/${repo}/issues/${number}`;
    this.getData(url).then(resp => this.proccessIssue(resp, state, context));
    // const {state: responseState} = result;
    // if (responseState === state) {
    //     context.report({
    //         message: 'A github issue has been resolved and some debt can now be removed',
    //     })
    // }
  }
};
