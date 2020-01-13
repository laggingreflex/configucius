const Config = require('.');
const _ = require('./utils');

module.exports = class extends Config {

  /**
   * Reads config from localstorage
   */
  $read(path) {
    const text = localStorage.getItem(path);
    try {
      return JSON.parse(text);
    } catch (error) {
      error = new Error(`Couldn't parse '${path}'. ${error.message}`);
      error.text = text;
      throw error;
    }
  }

  /**
   * Write config to localstorage
   */
  $write(path, config = this.filter()) {
    localStorage.setItem(path, JSON.stringify(config));
  }

  $prompt() { throw new Error('To be implemented') }
  $savePrompt() { throw new Error('To be implemented') }
};
