const _ = require('lodash')

export default function (argv = process.argv.slice(2)) {
  const config = this
  if (_.isString(argv)) {
    argv = argv.split(/[\s]+/g)
  }

  config.args = config.parseWithYargs(yargs => yargs.parse(argv))
}
