'use strict';

let Reporter = require('./base-notifier');
const fetch = require('node-fetch');

module.exports = class DateReporter extends Reporter {
  getData(url) {
    return fetch('https://github.com/')
      .then(res => res.text())
      .then(body => console.log(body));
  }

  checkForNotifications(context, [target, org, repo, number, state = 'RESOLVED']) {
    if (target !== 'ISSUE') {
      throw `${target} is not currently supported. Only issues are currently supported`;
    }
    const url = `api.github.com/${org}/${repo}/${number}`;
    const result = this.getData(url);
    // const {state: responseState} = result;
    // if (responseState === state) {
    //     context.report({
    //         message: 'A github issue has been resolved and some debt can now be removed',
    //     })
    // }
  }
};
