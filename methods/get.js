const _ = require('lodash')
const ority = require('ority')
const {
  keyPick,
  omitUndefined,
  returnFirstDefined
} = require('../utils')

module.exports = function (..._args) {
  let { key, opts } = ority(_args, [{
    key: ['string'],
    opts: 'object'
  }, {
    key: ['string']
  }, {
    opts: 'object'
  }, {}])
  opts = opts || {}

  const config = this

  let defaults
  if (opts.includeDefaults !== false) {
    defaults = config.getFromDefaults(...arguments)
  }
  const file = config.getFromFile(...arguments)
  const env = config.getFromEnv(...arguments)
  const args = config.getFromArgs(...arguments)

  let result

  if (typeof key === 'string') {
    result = returnFirstDefined([
      defaults,
      file,
      env,
      args,
      config.config[key]
    ].reverse())
  } else if (Array.isArray(key)) {
    return key.reduce((ret, key) => ({
      ...ret,
      [key]: returnFirstDefined([
        defaults,
        file,
        env,
        args,
        config.config[key]
      ].reverse()),
    }), {});
  } else if (!key) {
    const merged = _.extend({},
      omitUndefined(defaults || {}),
      omitUndefined(file),
      omitUndefined(env),
      omitUndefined(args),
      config.config,
    )
    // console.log({ merged })
    result = keyPick({
      args: arguments,
      source: merged,
      pickBy: (value, key) => !config.unsetKeys.includes(key)
    })
  } else {
    throw new Error('Invalid argument. Need either a string, array or nothing')
  }

  return result
}
