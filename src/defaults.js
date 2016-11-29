const defaults = {}

defaults.root = {
  type: 'string',
  default: process.cwd()
}

defaults.verbose = {
  alias: ['v'],
  type: 'count',
  default: 0
}
defaults.debug = {
  alias: ['d'],
  type: 'boolean',
  default: false
}

defaults.help = {
  alias: ['h', '?'],
  type: 'boolean'
}

export default defaults
