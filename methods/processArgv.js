const _ = require('lodash')

module.exports = function (argv = process.argv.slice(2)) {
  const config = this
  if (_.isString(argv)) {
    argv = argv.split(/[\s]+/g)
  }

  config.args = config.parseWithYargs(yargs => yargs.parse(argv))
}
