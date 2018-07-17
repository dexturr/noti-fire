#!/usr/bin/env node
'use strict';

const Cli = require('../lib/notifier-cli');
const args = process.argv.slice(2);
const configFilePathArg = args.find(arg => arg.startsWith('--configFilePath'));

const configFilePath = configFilePathArg ? configFilePathArg.split('=')[1] : process.cwd();
const files = args.filter(arg => !arg.startsWith('--'));

const cli = new Cli(files, { configFilePath });
cli.processFiles().then(result => {
  process.exitCode = result;
}).catch(() => {
  process.exitCode = 1;
});
