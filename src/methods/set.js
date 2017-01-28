import _ from 'lodash'
import isNumberLike from 'is-number-like'

export default function (key, value) {
  const config = this

  if (typeof value === 'undefined') {
    /* Please use `unset()` to unset a key */ throw new
    Error(`Need a value to set: set(${key}, <value>).`)
  }

  const opt = _.get(config, `options.${key}`)
  if (opt) {
    if (
      (!opt.type) ||
      (opt.type === typeof value) ||
      (opt.type === 'input' && _.isString(value)) ||
      (opt.type === 'password' && _.isString(value)) ||
      (opt.type === 'boolean' && _.isBoolean(value)) ||
      (opt.type === 'array' && _.isArray(value))
    ) {
      config.config[key] = value
    } else if (opt.type === 'number' && isNumberLike(value)) {
      config.config[key] = parseInt(value, 10)
    } else {
      throw new Error(`Expected value type "${opt.type}", got "${typeof value}" `)
    }
  } else if (config.opts.setOnlyDefined) {
    throw new Error(`Can't set key that's not defined in the options`)
  } else {
    config.config[key] = value
  }
  return value
}
