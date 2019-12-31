const Path = require('path');
const fs = require('fs-extra');
const untildify = require('untildify');
const dotenv = require('dotenv');
const yargs = require('yargs');
const _ = require('./utils');
const Config = require('.');
const enquire = require('enquire-simple');

module.exports = class ConfigNode extends Config {
  static cwd = process.cwd();
  static prompt = enquire;

  $cwd = this.constructor.cwd;

  $loadSaved() {
    for (const { path } of this.$paths) try {
      if (!fs.existsSync(path)) continue;
      // const config = JSON.parse(fs.readFileSync(path, 'utf8'));
      const config = fs.readJsonSync(path);
      this.$load(_.name(config, path));
    } catch (error) {
      throw new _.MergeError(new _.UserError(`Couldn't read/parse '${path}'`), error);
    }
  }

  $loadEnv({ dotenv: dotenvOpts = {}, yargs: yargsCb } = {}) {
    try {
      this.$yargs = yargs;
      dotenv.config(dotenvOpts);
      yargs.env();
      if (yargsCb) yargsCb(yargs);
      const argv = _.name(yargs.argv, 'yargs');
      this.$load(argv);
    } catch (error) {
      throw new _.MergeError(`Couldn't load Environment Variables.`, error);
    }
  }

  async $prompt(key, { message = null, set = true, skipIfExists = false, default: defaultValue = this.get(key) } = {}) {
    let value = this.get(key);
    if (this.has(key) && skipIfExists) return value;
    const opt = this.$options[key] || {};
    let type = opt.promptType || opt.type;
    if (!type) {
      type = _.typeof(value) || _.typeof(defaultValue);
    }
    if (opt.choices) type = 'select';
    message = message || opt.message || key;
    if (typeof message === 'function') message = await message.call(this, this);
    value = await enquire.prompt({
      ...opt,
      default: defaultValue,
      message,
      type,
      ...(opt.choices ? { choices: [...opt.choices] } : {}),
    });
    if (set !== false) {
      this.set(key, value);
    }
    return value;
  }

  $save(key, path) {
    try {
      path = this.$getPath(path);
      if (!path) throw new Error('Invalid path to save');
      if (key) {
        if (!this.has(key)) return;
        const option = this.$options[key] || {};
        if (option.save === false) throw new Error(`Save '${key}' is forbidden`);
        const existing = _.try(() => fs.readJsonSync(path.path)) || {};
        const value = this.get(key);

        if (value === this.constructor.symbol.delete) {
          if (!(key in existing)) return;
          delete existing[key];
        } else {
          existing[key] = value;
        }
        fs.outputFileSync(path.path, JSON.stringify(existing, null, 2) + '\n');
        console.log(`Saved '${key}' to ${path.original}`);
      } else {
        const all = this.$getAll();
        for (const key in all) {
          const option = this.$options[key] || {};
          if (option.save === false) delete all[key];
        }
        fs.outputFileSync(path.path, JSON.stringify(all, null, 2) + '\n');
        console.log(`Saved to ${path.original}`);
      }
    } catch (error) {
      throw new _.MergeError(`Couldn't save to '${path}'`, error);
    }
  }

  async $savePrompt(key, { message = 'Save? to: (Esc to cancel)', paths = this.$paths } = {}) {
    if (!paths.length) return;
    const choices = paths.map(p => p.original);
    const path = await this.constructor.prompt.select({ message, choices });
    if (!path) return;
    else return this.$save(key, path);
  }


  get $paths() {
    return super.$paths.map(({ key, path }) => ({ key, original: path, path: this.constructor.adjustPath(path) }));
  }
  static adjustPath(path) {
    // return
    path = untildify(path);
    if (!Path.isAbsolute(path)) {
      path = Path.join(this.cwd, path);
    }
    path = Path.join(path);
    return path;
  }
};
