const { keyPick } = require('../utils')

export default function (setting) {
  const config = this
  return keyPick({
    args: arguments,
    source: config.defaults
  })
}
