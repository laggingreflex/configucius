const { keyPick } = require('../utils')

module.exports = function (setting) {
  const config = this
  return keyPick({
    args: arguments,
    source: config.defaults
  })
}
