const { keyPick } = require('../utils')

export default function () {
  const config = this
  return keyPick({
    args: arguments,
    source: config.configFileContents
  })
}
