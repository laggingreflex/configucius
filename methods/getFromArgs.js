const arrify = require('arrify')
const _ = require('lodash')
const { keyPick } = require('../utils')

module.exports = function () {
  const config = this
  return keyPick({
    args: arguments,
    source: config.args,
    pickBy: (value, key) =>
      typeof value !== 'undefined' &&
      arrify(_.get(config, `opts.${key}.alias`)).indexOf(key) === -1
  })
}
