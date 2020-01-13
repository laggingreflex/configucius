const fs = require('fs');
const enquire = require('enquire-simple');
const Config = require('.');
const _ = require('./utils');
const { adjustPath } = require('./utils/node');

module.exports = class extends Config {

  static prompt = enquire;

  /**
   * Reads config from file
   * @param {string} path
   * @param {object} [opts]
   * @param {object} [opts.halt=true]
   * @param {object} [opts.exists]
   */
  $read(path, opts = {}) {
    path = adjustPath(this.constructor.getPath(path));
    const exists = fs.existsSync(path);
    if (!exists) {
      if (opts.exists) {
        throw new Error(`Path doesn't exist: '${path}'`)
      } else {
        return {};
      }
    };
    const text = fs.readFileSync(path, 'utf8');
    try {
      return JSON.parse(text);
    } catch (error) {
      error = new Error(`Couldn't parse '${path}'. ${error.message}`);
      error.text = text;
      throw error;
    }
  }

  /**
   * Write config to file
   */
  $write(path, config = this.$filter()) {
    path = adjustPath(this.constructor.getPath(path));
    fs.writeFileSync(path, JSON.stringify(config, null, 2) + '\n');
  }

  /**
   * Prompt user to enter value for a key
   */
  async $prompt(key, opts = {}) {
    if (key === undefined) throw new Error('Need a key to prompt');
    const oldValue = this[key];
    const newValue = await this.constructor.prompt({
      message: key,
      default: oldValue,
      ...opts,
    });
    if (newValue !== undefined) {
      this[key] = newValue;
    }
    return newValue;
  }

  /**
   * Prompt user to enter the path (if applicable) where to save
   */
  async $savePrompt(key, { paths = this.$path, message = 'Save to:', halt = false } = {}) {
    let path;
    paths = _.arrify(paths);
    if (!paths || !paths.length) {
      throw new Error('No paths to save');
    } else if (paths.length > 1) {
      const choices = [...paths];
      path = await this.constructor.prompt.select({ message, choices });
    } else {
      path = paths[0];
    }
    if (!path) {
      if (halt) {
        throw new Error('No path chosen')
      } else {
        return
      }
    }
    return this.$save({ key, path });
  }


  static promptableTypes = ['string', 'number', 'boolean', 'array'];

};
