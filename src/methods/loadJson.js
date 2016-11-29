import _ from 'lodash'
import JSON from 'json5'
import { error } from '../utils'

export default function (content) {
  const config = this
  let json
  if (_.isPlainObject(content)) {
    json = content
  } else if (_.isString(content)) {
    try {
      json = JSON.parse(content)
    } catch (err) {
      error.throwWithMsg(`Couldn't parse  config JSON: `, err)
    }
  } else {
    error.throwWithMsg(`Invalid content`)
  }
  return json
    // for (const key in json) {
    //   config.set(key, json[key]);
    // }
}
