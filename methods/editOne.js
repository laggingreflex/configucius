import _ from 'lodash'
import { prompt } from '../utils'

export default async function (setting, message) {
  const config = this
  const prev = config[setting]
  message = message || _.capitalize(_.startCase(setting)) + ':'
  const new1 = await prompt.input(message, config[setting])
  config[setting] = new1
  if (new1 === prev) {
    return false
  } else if (!new1 || !new1.length) {
    return false
  } else {
    return false
  }
}
