import { keyPick } from '../utils'

export default function () {
  const config = this
  return keyPick({
    args: arguments,
    source: config.configFileContents
  })
}
