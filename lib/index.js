const _ = require('./utils');

module.exports = class Config {

  // $file = null;

  $promises = new Set;
  $temp = {};
  $configs = [_.name(this.$temp, 'temp')];

  // keyNotFoundAction = null;

  /**
   * @param {object} opts
   * @param {object} [opts.config]
   * @param {string} [opts.path]
   */
  constructor(opts = {}) {

    // this.$configs.add()
    if (opts.config) {
      this.$load(opts.config);
    }
    this.$path = opts.path || this.constructor.path;
    // this.loadSaved();
    // this.loadEnv();
    // if (typeof opts === 'string') opts = { file: opts };
    // this.file = opts.file;

    // if (typeof opts === 'string' || Array.isArray(opts)) {
    //   opts = { file: opts };
    // }
    // this['#opts'] = { ...opts };
    // this.$configs = {};

    // this[$].config = {};
    // this.config = {}
    // this.file = {}
    // this.unsetKeys = []
    // this.opts = opts
    // // config.defaults = defaults
    // this.mergeOptions()
    // this.processArgv()
    // this.processEnv()
    // if (this.get('help')) {
    //   console.log('yeah', this.get('help'))
    //   this.printHelp(true)
    // }
    // this.readConfigFile({ silentReadFail: true })
    // return this.enableProxy()
  }

  // async init({ load = undefined } = {}) {
  //   // if (!this.file) throw new Error('Need a file');
  //   await this.enqueue(async () => {
  //     await this.load(load);
  //   });
  // }

  $load(config, { unshift = false } = {}) {
    if (!config) throw new Error('expected an object');
    if (unshift) {
      this.$configs.unshift(config);
    } else {
      this.$configs.push(config);
    }
    return config;
  }
  $loadSaved(...args) {
    throw new Error(`This was supposed to be overloaded for node/browser`);
  }
  $save(...args) {
    throw new Error(`This was supposed to be overloaded for node/browser`);
  }
  $loadEnv(...args) {
    // console.warn('This was supposed to be overloaded for node/browser');
  }

  * $getPaths(paths = this.$path) {
    if (!paths) return;
    if (typeof paths === 'string') paths = [paths];
    for (const [key, original] of Object.entries(paths)) {
      const path = this.constructor.adjustPath(original);
      yield { key, original, path };
    }
  }
  get $paths() {
    return Array.from(this.$getPaths());
  }
  $getPath(key = null, paths = this.$paths) {
    if (!paths.length) throw new Error('No path(s) exist');
    // else if (paths.length === 1) {
    //   if (key !== null) throw new Error('Key should not be used when only one path is set');
    //   else return paths[0].path
    else {
      const path = paths.find(p => p.key === key || p.path === key || p.original === key);
      if (!path) throw new Error(`Invalid key: '${key}'`);
      return path;
    }
  }

  static adjustPath(path) { return path }

  /**
   * @param {promise|function} item
   */
  async $enqueue(item) {
    if (typeof item === 'function') item = item();
    if (!(item instanceof Promise)) throw new Error('Need a Promise or a Function');
    this.$promises.add(item);
    try {
      return await item;
    } finally {
      // this.$promises.delete(item);
    }
  }
  /**
   * @param {string} key
   * @param {promise|function} item
   */
  async $enqueueValue(key, item) {
    this[key] = await this.$enqueue(item);
  }

  get $ready() {
    return Promise.all(this.$promises);
  }

  get(key) {
    if (!key) throw new Error('Need a key');
    for (const config of Array.from(this.$configs).reverse()) {
      const value = config[key]
      if (value !== undefined) {
        if (value === this.constructor.symbol.delete) {
          return undefined;
        } else {
          return value;
        }
      }
    }
  }
  has(key) {
    if (!key) throw new Error('Need a key');
    for (const config of this.$configs) {
      if (key in config) {
        return true;
        // if (config[key] === this.constructor.symbol.delete) {
        //   return false;
        // } else {
        //   return true;
        // }
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
    if (!key) throw new Error('Need a key');
    if (!value) throw new Error('Need a value');
    this.$temp[key] = value;
    this.$load({
      [key]: value
    });
  }
  delete(key) {
    this.set(key, this.constructor.symbol.delete);
  }

  // help() {
  //   throw new Error(`This was supposed to be overloaded for node/browser`);
  // }

  static symbol = {
    delete: Symbol('delete'),
  };

}
