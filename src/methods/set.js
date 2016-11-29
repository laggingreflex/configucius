import _ from 'lodash'

export default function (key, value) {
  const config = this
  const opt = _.get(config, `options.${key}`)
  if (opt) {
    if (
      (!opt.type) ||
      (opt.type === typeof value) ||
      (opt.type === 'boolean' && _.isBoolean(value)) ||
      (opt.type === 'array' && _.isArray(value))
    ) {
      config.config[key] = value
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
