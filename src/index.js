import autobind from 'auto-bind'
import defaults from './defaults'
import * as methods from './methods'

class Config {
  constructor (opts = {}) {
    autobind(this)

    const config = this

    config.config = {}
    config.file = {}

    config.opts = opts

    config.defaults = defaults

    config.processArgv()

    if (config.get('help')) {
      config.printHelp(true)
    }

    config.readConfigFile()

    return this.enableProxy()
  }
}

Object.assign(Config.prototype, methods)

export default Config
