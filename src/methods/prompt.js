import _ from 'lodash'
import { prompt } from '../utils'

export default async function (setting, promptOpts) {
  const config = this
  const opts = config.opts
  let options = opts.options
  if (_.isPlainObject(setting)) {
    promptOpts = setting
    setting = promptOpts.setting
  }
  promptOpts = promptOpts || {}

  if (_.isString(setting) || _.isArray(setting)) {
    options = _.pick(options, setting)
  } else {
    options = _.pickBy(options, (opt, key) => {
      if (promptOpts.all) {
        return true
      } else if (promptOpts.missing && !config.get(key)) {
        return true
      } else if (opt.prompt) {
        return true
      }
    })
  }

  for (const key in options) {
    const opt = options[key]
    const message = _.isString(opt.prompt) && opt.prompt || opt.description || opt.message || _.capitalize(_.startCase(key).toLowerCase())
    const method = opt.type === 'boolean' ? 'confirm'
      : opt.type === 'password' ? 'password'
      : 'input'
    const answer = await prompt[method](message, opt.default)
    config.set(key, answer)
  }
}
