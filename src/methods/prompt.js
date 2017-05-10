import _ from 'lodash'
import * as prompt from '../utils/prompt'
import ority from 'ority'

export default async function() {
  const config = this
  const opts = config.opts
  let options = opts.options

  let { setting, promptOpts } = ority(arguments, [{
    setting: ['string']
  }, {
    promptOpts: 'object'
  }, {
    setting: ['string'],
    promptOpts: 'object'
  }, {}])
  promptOpts = promptOpts || {}

  if (_.isString(setting) || _.isArray(setting)) {
    options = _.pick(options, setting)
  } else {
    options = _.pickBy(options, (opt, key) => {
      if (promptOpts.all) {
        return true
      } else if (promptOpts.savable && opt.save) {
        return true
      } else if (promptOpts.promptable && opt.prompt) {
        return true
      } else if (promptOpts.missing && !config.get(key)) {
        return true
      } else if (opt.prompt && !promptOpts.missing) {
        return true
      }
    })
  }

  const ret = {}
  for (const key in options) {
    const opt = options[key]

    let promptFnResult
    if (typeof opt.prompt === 'function') {
      promptFnResult = await opt.prompt(config.proxy || config);
      if (!promptFnResult) {
        continue;
      }
    }

    const message = opt.message
      || opt.description
      || _.isString(opt.prompt) && opt.prompt
      || _.isString(promptFnResult) && promptFnResult
      || _.capitalize(_.startCase(key).toLowerCase())

    const method = opt.type === 'boolean' ? 'confirm'
      : opt.type === 'password' ? 'password'
      : 'input'
    const defaultValue = config.get(key);
    let answer;
    if (promptOpts.required) {
      let retries = promptOpts.retries || 3;
      while (!answer && retries--) {
        answer = await prompt[method]('* ' + message, defaultValue);
      }
      if (!answer) {
        /* {require:true} was used for this */ throw new
        Error('Required option');
      }
    } else {
      answer = await prompt[method](message, defaultValue)
    }
    ret[key] = answer
    config.set(key, answer)
  }

  return ret
}
