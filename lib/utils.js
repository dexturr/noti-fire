'use strict';

const fetch = require('node-fetch');

const fetchUtil = async url => {
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


module.exports = {
  fetchUtil,
};
