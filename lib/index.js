const _ = require('./utils');
const enquire = require('enquire-simple');

module.exports = class Config extends Map {
  $temp = _.name({}, 'temp');
  $configs = [];
  static symbol = {
    delete: Symbol('delete'),
  };

  static path = null;
  static options = {};

  /**
   * @param {object} opts
   * @param {string} [opts.path]
   * @param {object} [opts.options]
   * @param {object} [opts.config]
   */
  constructor(opts = {}) {
    super();
    this.clear();
    this.$path = opts.path || this.constructor.path;
    this.$options = opts.options || this.constructor.options;
    this.$loadEnv();
    this.$loadSaved();
    if (opts.config) {
      this.$load(opts.config);
    }
  }

  $load(config, { unshift = false } = {}) {
    if (!config) throw new Error('expected an object');
    if (unshift) {
      this.$configs.unshift(config);
    } else {
      this.$configs.push(config);
    }
    return config;
  }

  $loadEnv(...args) {
    throw new Error(`This was supposed to be overloaded for node/browser`);
  }
  $loadSaved(...args) {
    throw new Error(`This was supposed to be overloaded for node/browser`);
  }
  $save(...args) {
    throw new Error(`This was supposed to be overloaded for node/browser`);
  }

  $applyPropertyAccessors() {
    for (const key in this.$options) {
      let opt = this.$options[key];
      if (opt.type || opt.default) {} else {
        opt = { default: opt, type: typeof opt };
      }
      Object.defineProperty(this, key, {
        get: () => {
          const get = () => this.get(key);
          if (opt.get) return opt.get.call(this, get);
          return get();
        },
        set: (value) => {
          const set = () => this.set(key, value);
          if (opt.set) return opt.set.call(this, value, set);
          return set();
        },
        configurable: true,
        enumerable: true,
      });
    }
  }

  get $paths() {
    const paths = [];
    for (const [key, original] of Object.entries(_.arrify(this.$path))) {
      const path = this.constructor.adjustPath(original);
      paths.push({ key, original, path });
    }
    return paths;
  }
  $getPath(input = null, paths = this.$paths) {
    if (!paths.length) throw new Error('No path(s) exist');
    if (paths.length === 1 && !input) return paths[0];
    const found = paths.find(p => p.key === input || p.path === input || p.original === input);
    if (!found) throw new Error(`No path found for: '${input}'`);
    return found;
  }

  get(key) {
    if (!key) throw new Error('Need a key');
    const defaultValue = key in this.$options ? this.$options[key].default : undefined;
    for (const config of Array.from(this.$configs).reverse()) {
      const value = config[key]
      if (value !== undefined) {
        if (value === this.constructor.symbol.delete) {
          return undefined;
        } else if (value === defaultValue) {
          continue;
        } else {
          return value;
        }
      }
    }
    return defaultValue;
  }
  has(key) {
    if (!key) throw new Error('Need a key');
    for (const config of this.$configs) {
      if (key in config) {
        if (config[key] === this.constructor.symbol.delete) {
          return false;
        } else {
          return true;
        }
      }
    }
    return false;
  }
  $getAll() {
    const all = Array.from(this.$configs).reduce((p, c) => ({ ...p, ...c }), {});
    for (const key in all) {
      if (all[key] === this.constructor.symbol.delete) {
        delete all[key];
      }
    }
    return all;
  }
  set(key, value) {
    if (key === undefined) throw new Error('Need a key');
    const option = this.$options[key] || {};
    const type = Array.isArray(value) ? 'array' : typeof value;
    if (option.type && type !== option.type) {
      throw new Error(`Expected '${key}' to be of type '${option.type}', got '${type}'`)
    }
    if (option.choices && !option.choices.includes(value)) {
      const error = new Error(`Value for '${key}' was set different from one of the possible choices for it`);
      error.details = { value, choices: option.choices };
      throw error;
    }
    if (option.validate && option.validate.call(this, value, key) === false) throw new Error(`Validation failed for '${key}'`);

    this.$temp[key] = value;
    this.$load({
      [key]: value
    });
    return this;
  }
  delete(key) {
    if (!this.has(key)) return false;
    this.set(key, this.constructor.symbol.delete);
    return true;
  }
  clear() {
    this.$temp = _.name({}, 'temp');
    this.$configs = [this.$temp];
  }

  * entries() {
    for (const entry of Object.entries(this.$getAll)) {
      yield entry;
    }
  }

  * keys() {
    for (const key of Object.keys(this.$getAll)) {
      yield key;
    }
  }

  * values() {
    for (const value of Object.values(this.$getAll)) {
      yield value;
    }
  }

  *[Symbol.iterator]() {
    return this.entries();
  }

  forEach(cb, thisArg) {
    for (const [key, value] of this.entries()) {
      cb.call(thisArg || this, value, key, this);
    }
  }

  get size() {
    return Object.keys(this.$getAll()).length;
  }

  get[Symbol.toStringTag]() {
    return '[object Config]';
  }

  get[Symbol.species]() {
    return Config;
  }

}
