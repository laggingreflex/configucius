const ority = require('ority')
const arrify = require('arrify')

module.exports = (_arguments, opts = []) => {
  const args = ority(_arguments, [{
    key: ['string'],
    opts: 'object'
  }, {
    key: ['string']
  }, {
    opts: 'object'
  }, ...opts, {}])

  args.opts = args.opts || {}
  args.keys = arrify(args.key || args.opts.key)
  for (const opt of opts) {
    for (const key in opt) {
      args[key] = typeof args[key] !== 'undefined' ? args[key]
        : args.opt[key]
    }
  }

  return args
}
