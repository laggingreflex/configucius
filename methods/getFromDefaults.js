import { keyPick } from '../utils'

export default function (setting) {
  const config = this
  return keyPick({
    args: arguments,
    source: config.defaults
  })
}
