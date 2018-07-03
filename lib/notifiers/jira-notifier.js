'use strict';

let Reporter = require('./base-notifier');

module.exports = class GithubReporter extends Reporter {

  constructor(fetch, baseUrl) {
    super('JIRA');
    this.baseUrl = baseUrl;
    this.fetch = fetch;
  }

  async getData(url) {
    return await this.fetch(url);
  }

  async checkForNotifications(context, [issueNumber, notifyStatus = 'Resolved']) {
    const url = `${this.baseUrl}/${issueNumber}`;
    const response = await this.getData(url);
    const { fields: { status: { name: statusName } } } = response;
    if (statusName === notifyStatus) {
      context.report({
        message: `Jira issue ${issueNumber} is now ${notifyStatus}`,
      });
    }
    return context;
  }
};
