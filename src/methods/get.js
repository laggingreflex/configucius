import _ from 'lodash'
import ority from 'ority'
import {
  keyPick,
  omitUndefined,
  returnFirstDefined
} from '../utils'

export default function (..._args) {
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
  } else {
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
  }

  return result
}
