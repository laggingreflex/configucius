const { keyPick } = require('../utils')

module.exports = function () {
  const config = this
  return keyPick({
    args: arguments,
    source: config.configFileContents
  })
}
