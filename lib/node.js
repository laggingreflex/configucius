const Path = require('path');
const fs = require('fs-extra');
const untildify = require('untildify');
const enquire = require('enquire-simple');
const dotenv = require('dotenv');
const yargs = require('yargs');
const _ = require('./utils');
const Config = require('.');

module.exports = class ConfigNode extends Config {
  static cwd = process.cwd();
  static prompt = enquire;

  $cwd = this.constructor.cwd;
  $prompt = this.constructor.prompt;

  $loadSaved() {
    for (const { path } of this.$paths) try {
      if (!fs.existsSync(path)) continue;
      const config = JSON.parse(fs.readFileSync(path, 'utf8'));
      this.$load(_.name(config, path));
    } catch (error) {
      throw new _.MergeError(new _.UserError(`Couldn't read/parse '${path}'`), error);
    }
  }

  $loadEnv({ dotenv: dotenvOpts = {}, yargs: yargsOpts = null } = {}) {
    try {
      this.$yargs = yargs;
      if (dotenvOpts) {
        dotenv.config(dotenvOpts);
      }
      let argv;
      const defaults = new class defaults {};
      if (typeof yargsOpts === 'function') {
        const y = yargsOpts(yargs) || yargs;
        argv = y.argv || y;
      } else {
        const opts = yargsOpts || {};
        if (opts.options) {
          yargs.options(opts.options);
        }
        if (opts.env) {
          yargs.env(opts.env);
        }
        if (opts.command) {
          yargs.command(opts.command);
        }
        if (opts.commands) {
          if (!Array.isArray(opts.commands)) throw new Error('Expected `opts.commands` to be an Array');
          for (const command of opts.commands) {
            yargs.command(command);
          }
        }
        if ('wrap' in opts) {
          yargs.wrap(opts.wrap);
        }
        if ('help' in opts) {
          yargs.help(opts.help);
        }
        if ('version' in opts) {
          yargs.version(opts.version);
        }
        if (opts.scriptName) {
          yargs.scriptName(opts.scriptName);
        }
        argv = yargs.argv;
        argv = _.name(argv, 'yargs');
        const yargsDefaults = yargs.defaults('(dummy key to extract defaults)');
        for (const key in argv) {
          if (key in yargsDefaults.parsed.defaulted) {
            defaults[key] = argv[key];
            delete argv[key];
          }
        }
      }
      // this.$load(defaults);
      this.$load(argv);
      this.$configs.splice(1, 0, defaults);
      // console.log(`this.$configs:`, this.$configs);
    } catch (error) {
      // throw error
      throw new _.MergeError(`Couldn't load Environment Variables.`, error);
    }
  }

  $save(path, key) {
    try {
      path = this.$getPath(path);
      if (!path) throw new Error('Invalid path to save');
      if (key) {
        if (!this.has(key)) return;
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
        fs.outputFileSync(path.path, JSON.stringify(this.$getAll(), null, 2) + '\n');
        console.log(`Saved to ${path.original}`);
      }
    } catch (error) {
      throw new _.MergeError(`Couldn't save to '${path}'`, error);
    }
  }

  async $savePrompt(key, { message = 'Save?', paths = this.$paths } = {}) {
    try {
      if (!paths.length) return;
      const no = 'No';
      const choices = [no, ...paths.map(p => p.original)];
      const path = await this.constructor.prompt.select({ message, choices });
      if (path === no) return;
      else return this.$save(path, key);
    } catch (error) {
      throw new _.MergeError(`Error prompting to save`, error);
    }
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
