import _ from 'lodash'
import { keyPick } from '../utils'

export default function (setting) {
  const config = this
  return keyPick({
    args: arguments,
    source: extend({},
      config.getFromFile(...arguments),
      config.getFromArgs(...arguments),
      config.config,
    )
  })
  return _.get(config, `opts.${setting}.default`)
}
