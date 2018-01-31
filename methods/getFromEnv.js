const { keyPick } = require('../utils')

module.exports = function () {
  const config = this
  const keys = config.getOptionKeys()
  return keyPick({
    args: arguments,
    source: config.env,
    pickBy: (value, key) => keys.includes(key)
  })
}
