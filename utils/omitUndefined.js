const _ = require('lodash')

module.exports = (options) => {
  return _.omitBy(options, _.isUndefined)
}
