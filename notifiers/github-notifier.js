'use strict';

let Reporter = require('./base-notifier');
const fetch = require('node-fetch');

module.exports = class GithubReporter extends Reporter {

  constructor() {
    super('GITHUB');
  }

  async getData(url) {
    const response = await fetch(url);
    return await response.json();
  }

  async checkForNotifications(context, [target, org, repo, number, notifyState = 'closed']) {
    if (target !== 'ISSUE') {
      throw `${target} is not currently supported. Only issues are currently supported`;
    }
    const url = `https://api.github.com/repos/${org}/${repo}/issues/${number}`;
    const response = await this.getData(url);
    const { state } = response;
    console.log(state, notifyState);
    if (state === notifyState) {
      context.report({
        message: `Github issue is now ${state}, this can now be reviewed`,
      });
    }
    console.log('hi');
    return context;
    // const {state: responseState} = result;
    // if (responseState === state) {
    //     context.report({
    //         message: 'A github issue has been resolved and some debt can now be removed',
    //     })
    // }
  }
};
