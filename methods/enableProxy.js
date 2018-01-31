const _ = require('lodash')

const defaultHandler = {
  get (config, key) {
    return config[key] || config.get(key)
  },
  set (config, key, value) {
    const opt = _.get(config, `options.${key}`)
    if (opt) {
      config.set(key, value)
    } else {
      config[key] = value
    }
    return true
  }
}

module.exports = function (handler = defaultHandler) {
  if (typeof Proxy !== 'undefined' && !this.proxyEnabled) {
    const proxy = new Proxy(this, handler)
    this.proxy = proxy;
    proxy.proxyEnabled = true
    return proxy
  } else {
    return this
  }
}

