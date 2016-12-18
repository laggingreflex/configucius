import _ from 'lodash'
import fs from 'fs-promise'
import JSON from 'json5'
import ority from 'ority'
import { error } from '../utils'

export default function () {
  const config = this

  let {configFile, opts} = ority(arguments, [{
    configFile: 'string',
    opts: 'object'
  }, {
    configFile: 'string'
  }, {
    opts: 'object'
  }, {}])

  opts = opts || {}
  configFile = configFile || opts.configFile || config.getConfigFile({silent: true})

  if (typeof configFile !== 'string' || !configFile.length) {
    if (typeof config.configFileNotExistsFlag === 'undefined') {
      config.configFileNotExistsFlag = true
    }
    return false
  }

  let raw, json

  try {
    raw = fs.readFileSync(configFile)
  } catch (err) {
    if (opts.silent || opts.silentReadFail) {
      return
    } else {
      return error.throwWithMsg(`Couldn't read from {configFile: ${configFile}}: `, err)
    }
  }
  try {
    json = JSON.parse(raw)
  } catch (err) {
    if (opts.silent || opts.silentParseFail) {
      return
    } else {
      return error.throwWithMsg(`Couldn't parse JSON from {configFile: ${configFile}}: `, err, {raw})
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
