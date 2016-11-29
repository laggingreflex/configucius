import _ from 'lodash'

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

export default function (handler = defaultHandler) {
  if (typeof Proxy !== 'undefined' && !this.proxyEnabled) {
    const config = new Proxy(this, handler)
    config.proxyEnabled = true
    return config
  } else {
    return this
  }
}

