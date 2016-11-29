import _ from 'lodash'

export default function (setting) {
  const config = this
  return _.get(config, `opts.${setting}.default`)
}
