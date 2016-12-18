import arrify from 'arrify'
import _ from 'lodash'

export default function () {
  const config = this
  return Object.keys(config.options).concat(...arrify(_.map(config.options, ({ alias }) => arrify(alias)))).filter(Boolean)
}
