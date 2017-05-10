import _ from 'lodash'
import fs from 'fs-extra'
import deepEqual from 'deeper'
import ority from 'ority'
import { error, keyPick } from '../utils'

export default async function (...args) {
  let { key, opts } = ority(args, [{
    key: ['string'],
    opts: 'object'
  }, {
    key: ['string']
  }, {
    opts: 'object'
  }, {}])
  opts = opts || {}

  const config = this

  let configFile
  try {
    configFile = opts.configFile || config.getConfigFile()
  } catch (err) {
    error.throwWithMsg(`Cannot save: `, err)
  }

  let contents = keyPick({
    args: arguments,
    source: config.get(...[key, { ...opts, includeDefaults: false }].filter(Boolean)),
    pickBy: (opt, key) => opts.all || _.get(config, `opts.options.${key}.save`)
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

  if (changedLength !== 0 && (opts.saveStrict || config.opts.saveStrict || config.get('saveStrict'))) {
    const label = changedLength < 0 ? 'fewer' : 'more'
    const unsigned = Math.abs(changedLength)
    const keys = []
    keys.push(..._.map(addedContent, (value, key) => '+' + key))
    keys.push(..._.map(deletedContent, (value, key) => '-' + key))
    /* `saveStrict` prevents adding or removing keys from config */ throw new
    Error(`Cannot save: newer config has [${unsigned}] ${label} keys than the original [${keys}]. Either override all settings or delete previous config file: ${config.getConfigFile({silent: true})}.`)
  }

  if (deletedLength && previousLength && !(opts.saveLossy || config.opts.saveLossy || config.get('saveLossy'))) {
    /* To prevent accidental config wipe-out/loss. Set `saveLossy` to override */ throw new
    Error(`Cannot save: newer config has [${deletedLength}] fewer keys than original [${Object.keys(deletedContent)}]. Either override all settings, or pass '--save-lossy' argument, or delete previous config file: ${config.getConfigFile({silent: true})}.`)
  }

  try {
    await fs.outputFile(configFile, JSON.stringify(contents, null, 2))
  } catch (error) {
    /* There was an error saving settings to the specified `configFile` */ throw new
    Error(`Couldn't save to file "${configFile}". ` + error.message)
  }

  if (!opts.saveLossy) {
    config.configFileContents = contents
  }

  return { file: configFile, new: addedContent, previous: previousContents, deleted: deletedContent, changed: changedContent }
}
