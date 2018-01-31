const _ = require('lodash')

module.exports = function (key) {
  const config = this

  if (!config.unsetKeys.includes(key)) {
    config.unsetKeys.push(key)
  }
}
