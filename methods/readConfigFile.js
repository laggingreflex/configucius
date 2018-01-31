const _ = require('lodash')
const fs = require('fs-extra')
const JSON = require('json5')
const yaml = require('js-yaml')
const ority = require('ority')
const { error } = require('../utils')

module.exports = function() {
  const config = this

  let { configFile, opts } = ority(arguments, [{
    configFile: 'string',
    opts: 'object'
  }, {
    configFile: 'string'
  }, {
    opts: 'object'
  }, {}])

  opts = opts || {}
  configFile = configFile || opts.configFile || config.getConfigFile({ silent: true })

  if (typeof configFile !== 'string' || !configFile.length) {
    if (typeof config.configFileNotExistsFlag === 'undefined') {
      config.configFileNotExistsFlag = true
    }
    return false
  }

  let json, stats, nonEmpty, jsonError, yamlError, requireError;

  try {
    stats = fs.statSync(configFile);
  } catch (error) {

  }

  if (stats && stats.isFile()) {
    nonEmpty = true;
    const raw = fs.readFileSync(configFile);
    [jsonError, json] = tryParseJson(raw);
    if (!json) {
      [yamlError, json] = tryParseYaml(raw);
      if (typeof json === 'string') {
        json = null;
      }
    }
    if (!json) {
      [requireError, json] = tryRequire(configFile);
    }
  } else if (stats && stats.isDirectory()) {
    nonEmpty = true;
    [requireError, json] = tryRequire(configFile);
  }

  if (jsonError) {
    jsonError.message = `Couldn't parse JSON from {configFile: ${configFile}}: ` + jsonError.message
  } else if (requireError) {
    requireError.message = `Couldn't require {configFile: ${configFile}}: ` + requireError.message
  } else if (yamlError) {
    yamlError.message = `Couldn't parse YAML from {configFile: ${configFile}}: ` + yamlError.message
  }

  if (!json) {
    const error = jsonError || requireError;
    if (error) {
      if (nonEmpty) {
        error.message = 'Non-empty config file contains invalid JSON or JS. ' + error.message;
        throw error;
      } else if (opts.silent || opts.silentParseFail) {
        return;
      } else {
        error.message = `Couldn't find/parse {configFile: ${configFile}}. ` + error.message;
        throw error;
      }
    }
  }

  if (opts.replace) {
    config.configFileContents = json
  } else if (opts.merge) {
    config.configFileContents = _.merge({}, config.configFileContents, json)
  } else {
    config.configFileContents = _.extend({}, config.configFileContents, json)
  }

  if (config.configFileNotExistsFlag) {
    config.configFileNotExistsFlag = false
  }

  return json
}


function tryParseJson(raw) {
  try {
    return [null, JSON.parse(raw)];
  } catch (err) {
    return [err];
  }
}

function tryParseYaml(raw) {
  try {
    return [null, yaml.safeLoad(raw)];
  } catch (err) {
    return [err];
  }
}

function tryRequire(path) {
  try {
    return [null, require(path)];
  } catch (err) {
    return [err];
  }
}
