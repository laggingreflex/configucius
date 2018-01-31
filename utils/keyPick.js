const _ = require('lodash')
const orityKeysOpts = require('./orityKeysOpts')

module.exports = ({ args, source = {}, pickBy }) => {
  const { keys, opts } = orityKeysOpts(args)

  if (keys.length === 1) {
    const [key] = keys
    return source[key]
  } else {
    let ret = pickBy ? _.pickBy(source, pickBy) : source
    if (keys.length > 1) {
      ret = _.pick(ret, keys)
    }
    if (opts.exclude && opts.exclude.length) {
      ret = _.omit(ret, opts.exclude)
    }
    return ret
  }
}
