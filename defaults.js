const readPkgUp = require('read-pkg-up')

let parentPkg
try {
  parentPkg = readPkgUp.sync(module.parent.parent.filename).pkg
} catch (noop) {}
parentPkg = parentPkg || {}

const defaults = {}

defaults.root = {
  alias: 'cwd',
  type: 'string',
  default: process.cwd()
}

defaults.name = {
  type: 'string',
  default: parentPkg.name
}

defaults.configFile = {
  type: 'string'
}
defaults.editConfig = {
  type: 'boolean'
}

defaults.verbose = {
  alias: ['v'],
  type: 'count',
  default: 0
}
defaults.nodeEnv = {
  type: 'string'
}

defaults.ip = {
  type: 'string'
}
defaults.port = {
  type: 'number'
}

defaults.help = {
  alias: ['h', '?'],
  type: 'boolean'
}

export default defaults
