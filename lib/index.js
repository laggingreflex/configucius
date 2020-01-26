const _ = require('./utils');

module.exports = class Config {

  static path;

  /**
   * Initialize
   * @param {object} [o]
   * @param {object} [o.path] Path(s) to use for saving/loading
   */
  constructor({ path } = {}) {
    _.define(this, '$path', { value: path || this.constructor.path });
  }

  $read(...args) { throw new Error(`This should've been overridden by child (node/browser) implementation`) }
  $write(...args) { throw new Error(`This should've been overridden by child (node/browser) implementation`) }

  /**
   * Load config from an object or a path
   * @param {object|string} [config]
   * @param {object} [opts]
   * @param {object} [opts.keys=OwnPropertyNames]
   */
  $load(config, opts) {
    if (!config) {
      config = {};
      for (const path of _.arrify(this.$path)) {
        const read = this.$read(path, opts);
        Object.assign(config, read);
      }
    } else if (typeof config === 'string' || 'number' == typeof config) {
      config = this.$read(config, opts);
    }
    for (const key of (opts && opts.keys) || Object.getOwnPropertyNames(this)) {
      if (key in config) {
        const newValue = config[key];
        if (newValue === undefined) {
          delete this[key];
        } else {
          this[key] = newValue;
        }
      }
    }
  }

  /**
   * Save config (or a part of it) to path
   * @param {object} [opts]
   * @param {string|array} [opts.key] Key to save
   * @param {string|number} [opts.path] Path to save to
   * @param {array|object} [opts.paths] Paths to choose path from
   */
  $save({ key, path } = {}) {
    path = this.constructor.getPath(path);
    const config = this.$filter(key);
    let existing = this.$read(path);
    Object.assign(existing, config);
    return this.$write(path, existing);
  }

  /**
   * Get a new config filtered with specified key(s)
   * @param {string|array} [keys=all]
   */
  $filter(keys) {
    const config = {};
    keys = _.arrify(keys);
    if (!keys.length) keys = Object.getOwnPropertyNames(this);
    for (const key of keys) {
      config[key] = this[key];
    }
    return config;
  }

  static getPath(path, paths = this.path) {
    paths = _.arrify(this.path);
    if (path === undefined) return paths[0];
    if (typeof path === 'number' && paths[path]) return paths[path];
    if (path in paths) return paths[path];
    if (paths.includes(path)) return path;
    console.log({ path, paths });
    throw new Error(`Invalid path or index: '${path}'`);
  }
}
