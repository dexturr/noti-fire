'use strict';

const fetch = require('node-fetch');
let glob = require('glob');
const fs = require('fs');

const pathToGlobAsync = pattern => new Promise((resolve, reject) => {
  fs.stat(pattern, (err, stats) => {
    if (err) {
      reject(err);
    }
    const isDirectory = stats.isDirectory();
    const glob = isDirectory ? `${pattern}/**/*.js` : pattern;
    resolve(glob);
  });
});

const globToFilesAsync = globPattern => new Promise((resolve, reject) => {
  glob(globPattern, (err, files) => {
    if (err) {
      reject(err);
    }
    resolve(files);
  });
});

const fetchUtilAsync = async url => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    }
    throw new Error(response.statusText);
  } catch (e) {
    throw new Error('Could not connect to the internet');
  }
};

const readFileAsync = filePath => new Promise((resolve, reject) => {
  fs.readFile(filePath, { encoding: 'UTF-8' }, (err, buffer) => {
    if (err) {
      reject(err);
    }
    resolve(buffer);
  });
});


module.exports = {
  fetchUtilAsync,
  readFileAsync,
  pathToGlobAsync,
  globToFilesAsync,
};
