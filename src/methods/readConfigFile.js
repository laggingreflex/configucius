import fs from 'fs-promise'
import untildify from 'untildify'
import { error } from '../utils'

export default function () {
  const config = this

  let configFile = config.getFromArgs('configFile') || config.getDefault('configFile')

  if (configFile) {
    try {
      const configFileContents = fs.readFileSync(untildify(configFile))
      config.file = config.loadJson(configFileContents)
    } catch (err) {
      error.throwWithMsg(`Couldn't read from {configFile: ${configFile}}: `)
    }
  } else {
    config.configFileNotExistsFlag = true
    return false
  }
}
