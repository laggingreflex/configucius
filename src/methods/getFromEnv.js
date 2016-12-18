import _ from 'lodash'
import { keyPick } from '../utils'

export default function () {
  const config = this
  const keys = config.getOptionKeys()
  return keyPick({
    args: arguments,
    // source: _.mapKeys(process.env, (value, key) => _.camelCase(key)),
    source: config.env,
    pickBy: (value, key) => keys.includes(key)
  })
}
