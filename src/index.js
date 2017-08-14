import autobind from 'auto-bind'
import defaults from './defaults'
import * as methods from './methods'

class Config {
  constructor (opts = {}) {
    autobind(this)

    const config = this

    config.config = {}
    config.file = {}
    config.unsetKeys = []

    config.opts = opts

    // config.defaults = defaults

    config.mergeOptions()
    config.processArgv()
    config.processEnv()

    if (config.get('help')) {
      console.log('yeah', config.get('help'))
      config.printHelp(true)
    }

    config.readConfigFile({ silentReadFail: true })

    return this.enableProxy()
  }
}

Object.assign(Config.prototype, methods)

export default Config
