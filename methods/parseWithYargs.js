const _ = require('lodash')
const Yargs = require('yargs')
const arrify = require('arrify')
const prompt = require('../utils')

export default function (fn) {
  const config = this
  const opts = config.opts

  const yargs = (new Yargs()).options(config.options)
  let args = fn(yargs)

  // remove aliases
  args = _.omit(args, getAliases(opts.options))

  // fixDuplicates
  if (opts.duplicateArgumentsArray === false) {
    args = fixDuplicates(args, opts.options)
  }

  // fixBooleans
  // yargs make falsey values into booleans, here we don't need that, we store defaults values and other such things all separately. (in fact it's causing bugs)
  args = fixBooleans(args, opts.options)

  return args
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

export function fixBooleans (args, options) {
  for (const key in args) {
    const val = args[key];
    if (val === false || undefined === val) {
      delete args[key];
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
