'use strict';

const Notifier = require('./index');
const DateNotifier = require('./notifiers/date-notifier');
const GithubNotifier = require('./notifiers/github-notifier');
const JiraNotifier = require('./notifiers/jira-notifier');
const NotificationFactory = require('./notification-factory');
const Context = require('./context');
const chalk = require('chalk');
const path = require('path');

const {
  fetchUtilAsync,
  pathToGlobAsync,
  globToFilesAsync,
  readFileAsync,
} = require('./utils');

module.exports = class NotifierCli {

  constructor(fileOrDirectory, options) {
    this.fileOrDirectory = fileOrDirectory;
    this.options = options;
  }

  get config() {
    let { configFilePath, basePath } = this.options;
    if (!configFilePath.endsWith('.notifirerc.js')) {
      configFilePath = `${configFilePath}/.notifirerc`;
    }
    const resolvedConfigFilePath = path.resolve(basePath, configFilePath);
    return require(resolvedConfigFilePath);
  }

  getNotifiers(config, fetch) {
    const githubNotifier = new GithubNotifier(fetch, config);
    const jiraNotifier = new JiraNotifier(fetch, config);
    const dateNotifier = new DateNotifier(config);
    return [dateNotifier, jiraNotifier, githubNotifier];
  }

  generateFactory() {
    const fetch = this.options.fetch || fetchUtilAsync;
    const notifiers = this.getNotifiers(this.config, fetch);
    const factory = new NotificationFactory(notifiers);
    this.factory = factory;
  }

  async getFileList() {
    const globPromiseArray = this.fileOrDirectory.map(file => pathToGlobAsync(file));
    const globs = await Promise.all(globPromiseArray);
    const filesPromisesArray = globs.map(globPath => globToFilesAsync(globPath));
    const files = await Promise.all(filesPromisesArray);
    // Flatten jagged array
    return Array.prototype.concat.apply([], files);
  }

  async processFiles() {
    await this.generateFactory();
    const fileList = await this.getFileList();
    console.log(fileList);
    const promises = fileList.map(this.processFile.bind(this));
    const result = await Promise.all(promises);
    const hasErrors = result.reduce((previousValue, currentValue) => previousValue && currentValue, true);
    return hasErrors ? 1 : 0;
  }

  async processFile(filePath) {
    const text = await readFileAsync(filePath);
    const { ecmaVersion } = this.config;
    const context = new Context();
    const notifier = new Notifier(text, this.factory, context, { ecmaVersion });
    const log = this.options.log || console.log;
    await notifier.processComments();
    for (const error of context.errors) {
      const begining = chalk.red('Error');
      const msg = chalk.yellow(error.message);
      const notifire = chalk.dim(error.type);
      const filePathMsg = chalk.green(filePath);
      log(`${begining} (${notifire}): ${msg} at ${filePathMsg}`);
    }
    return !!context.errors.length;
  }

};
