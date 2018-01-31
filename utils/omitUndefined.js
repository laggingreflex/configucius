const _ = require('lodash')

export default (options) => {
  return _.omitBy(options, _.isUndefined)
}
