const arrify = require('arrify')
const _ = require('lodash')

module.exports = function () {
  const config = this
  return Object.keys(config.options).concat(...arrify(_.map(config.options, ({ alias }) => arrify(alias)))).filter(Boolean)
}
