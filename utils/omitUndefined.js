import _ from 'lodash'

export default (options) => {
  return _.omitBy(options, _.isUndefined)
}
