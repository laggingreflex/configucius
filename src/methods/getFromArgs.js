import arrify from 'arrify'

export default function (setting) {
  const config = this
  const args = config.args
  const opts = config.opts
  const opt = opts[setting] || {}
  const aliases = arrify(opt.alias)
  for (const alias in aliases) {
    if (args[alias]) {
      return args[alias]
    }
  }
}
