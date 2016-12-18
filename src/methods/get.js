import _ from 'lodash'
import { keyPick } from '../utils'

export default function (key) {
  const config = this

  if (typeof key === 'string') {
    return returnFirstDefined(
      config.getFromEnv(...arguments),
      config.getFromFile(...arguments),
      config.getFromArgs(...arguments),
      config.config[key]
    )
  } else {
    return keyPick({
      args: arguments,
      source: _.extend({},
        config.getFromEnv(...arguments),
        config.getFromFile(...arguments),
        config.getFromArgs(...arguments),
        config.config,
      ),
      pickBy: (value, key) => !config.unsetKeys.includes(key)
    })
  }
}

function returnFirstDefined (...args) {
  for (const arg of args) {
    if (typeof arg !== 'undefined') {
      return arg
    }
  }
}
