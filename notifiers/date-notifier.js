'use strict';

let Reporter = require('./base-notifier');

module.exports = class DateReporter extends Reporter {

  constructor() {
    super('DATE');
  }

  checkForNotifications(context, [date]) {
    const currentDate = new Date();
    const inputDate = new Date(date);
    if (inputDate < currentDate) {
      context.report({
        message: 'Code is due to be reviewed',
      });
    }
  }
};
