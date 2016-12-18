import arrify from 'arrify'
import _ from 'lodash'
import { keyPick } from '../utils'

export default function () {
  const config = this
  return keyPick({
    args: arguments,
    source: config.args,
    pickBy: (value, key) =>
      typeof value !== 'undefined' &&
      arrify(_.get(config, `opts.${key}.alias`)).indexOf(key) === -1
  })
}
