import _ from 'lodash'

export default function (key) {
  const config = this

  if (!config.unsetKeys.includes(key)) {
    config.unsetKeys.push(key)
  }
}
