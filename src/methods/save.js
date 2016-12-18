import _ from 'lodash'
import fs from 'fs-promise'
import deepEqual from 'deeper'
import { error, keyPick } from '../utils'

export default async function (opts) {
  const config = this

  opts = opts || {}

  let configFile
  try {
    configFile = config.getConfigFile()
  } catch (err) {
    error.throwWithMsg(`Cannot save: `, err)
  }

  let contents = keyPick({
    args: arguments,
    source: config.get(...arguments),
    pickBy: (opt, key) => _.get(config, `opts.options.${key}.save`)
  })

  contents = _.pickBy(contents, a => _.isArray(a) || _.isString(a) ? a.length : true)

  const previousContents = config.getFromFile()
  const addedContent = {}
  const deletedContent = {}
  const changedContent = {}
  for (const key in contents) {
    if (!(key in previousContents)) {
      addedContent[key] = contents[key]
    }
  }
  for (const key in previousContents) {
    if (key in contents) {
      if (!deepEqual(contents[key], previousContents[key])) {
        changedContent[key] = contents[key]
      }
    } else {
      deletedContent[key] = previousContents[key]
    }
  }

  const currentLength = Object.keys(contents).length
  const previousLength = Object.keys(previousContents).length
  const deletedLength = Object.keys(deletedContent).length
  const changedLength = currentLength - previousLength

  if (changedLength !== 0 && (opts.saveStrict || config.opts.saveStrict)) {
    const label = changedLength < 0 ? 'fewer' : 'more'
    const unsigned = Math.abs(changedLength)
    const keys = []
    keys.push(..._.map(addedContent, (value, key) => '+' + key))
    keys.push(..._.map(deletedContent, (value, key) => '-' + key))
    /* `saveStrict` prevents adding or removing keys from config */ throw new
    Error(`Cannot save: newer config has [${unsigned}] ${label} keys than the original [${keys}]`)
  }

  if (deletedLength && previousLength && !(opts.saveLossy || config.opts.saveLossy)) {
    /* To prevent accidental config wipe-out/loss. Set `saveLossy` to override */ throw new
    Error(`Cannot save: newer config has [${deletedLength}] fewer keys than original [${Object.keys(deletedContent)}]. Set 'saveLossy' to override`)
  }

  try {
    await fs.outputFile(configFile, JSON.stringify(contents, null, 2))
  } catch (error) {
    /* There was an error saving settings to the specified `configFile` */ throw new
    Error(`Couldn't save to file "${configFile}". ` + error.message)
  }
  config.configFileContents = contents

  return {file: configFile, new: addedContent, previous: previousContents, deleted: deletedContent, changed: changedContent}
}
