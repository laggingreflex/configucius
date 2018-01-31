const path = require('path')
const untildify = require('untildify')

export default function (opts = {}) {
  const config = this

  let configFile = config.get('configFile') || config.opts.configFile
  if (!configFile) {
    let name = config.get('name')
    if (name) {
      configFile = path.join('~', '.' + name)
    } else if (!opts.silent) {
      /* Please define a `configFile` setting, or a `name` for it to be inferred as '~/.[name]' */ throw new
      Error(`'configFile' setting not defined`)
    } else {
      return false
    }
  }

  return untildify(configFile)
}
