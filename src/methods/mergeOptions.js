import _ from 'lodash'

export default function () {
  const config = this
  const opts = config.opts

  const merge = _[opts.mergeDefaults ? 'merge' : 'extend']
  config.options = merge({}, config.defaults, opts.options || {})
}
