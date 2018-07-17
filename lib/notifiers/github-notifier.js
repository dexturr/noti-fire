'use strict';

let Reporter = require('./base-notifier');

module.exports = class GithubReporter extends Reporter {

  constructor(fetch) {
    super('GITHUB');
    this.fetch = fetch;
  }

  async getData(url) {
    return await this.fetch(url);
  }

  async checkForNotifications(context, [target, org, repo, number]) {
    const notifyState = 'closed';
    if (target !== 'ISSUE') {
      throw `${target} is not currently supported. Only issues are currently supported`;
    }
    const url = `https://api.github.com/repos/${org}/${repo}/issues/${number}`;
    const response = await this.getData(url);
    const { state } = response;
    if (state === notifyState) {
      context.report({
        message: `Github issue is now ${state}, this can now be reviewed`,
        type: this.type,
      });
    }
    return context;
  }
};
