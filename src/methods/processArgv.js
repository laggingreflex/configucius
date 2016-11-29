import _ from 'lodash'
import Yargs from 'yargs'
import arrify from 'arrify'
import prompt from '../utils'

export default function (argv = process.argv.slice(2)) {
  const config = this
  const opts = config.opts
  if (_.isString(argv)) {
    argv = argv.split(/[\s]+/g)
  }

  const merge = _[opts.mergeDefaults ? 'merge' : 'extend']
  const options = merge({}, config.defaults, opts.options || {})
  config.options = options

  const yargs = config.yargs = new Yargs()
  let args = yargs.options(options).parse(argv)

  // remove aliases
  args = _.omit(args, getAliases(opts.options))

  // fixDuplicates
  if (opts.duplicateArgumentsArray === false) {
    args = fixDuplicates(args, opts.options)
  }

  config.args = args
}

export function getAliases (options) {
  const aliases = []
  for (const key in options) {
    if (options[key].alias) {
      aliases.push(...arrify(options[key].alias))
    }
  }
  return aliases
}

export function fixDuplicates (args, options) {
  for (const key in args) {
    if (key !== '_' && _.isArray(args[key]) && _.get(options, `${key}.type`) !== 'array') {
      args[key] = args[key].pop()
    }
  }
  return args
}

export function meetDemands (options) {
  for (const key in options) {
    const opt = options[key]
    if ((opt.demand || opt.required) && opt.prompt) {
      const message = opt.description || opt.message || _.capitalize(_.startCase(key).toLowerCase())
      if (!opt.type || opt.type === 'string') {
        prompt.input(message, opt.default)
      }
    }
  }
}
