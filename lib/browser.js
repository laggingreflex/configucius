const Path = require('path');
const _ = require('./utils');
const Config = require('.');

module.exports = class ConfigNode extends Config {
  constructor(opts) {
    super(opts);
    this.loadSaved();
  }

  loadSaved(paths = this.path) {
    if (!paths) return;
    if (typeof paths === 'string') paths = [paths];
    for (let [key, path] of Object.entries(paths)) {
      try {
        const config = JSON.parse(localStorage.getItem(path));
        this.load(config);
      } catch (error) {
        console.warn(`Couldn't load config from path: '${path}'. ${error.message}`);
      }
    }
  }

};
