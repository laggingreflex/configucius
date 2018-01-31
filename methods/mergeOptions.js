const _ = require('lodash')

module.exports = function () {
  const config = this
  const opts = config.opts

  const merge = _[opts.mergeDefaults ? 'merge' : 'extend']
  config.options = merge({}, config.defaults, opts.options || {})
  config.defaults = _.mapValues(config.options, option => option.default)
  config.defaults = _.omitBy(config.defaults, _.isUndefined)
  // console.log({ defaults: config.defaults })
  config.options = _.mapValues(config.options, option => _.omit(option, ['default']))
}
