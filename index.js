/** https://github.com/visionmedia/debug/blob/master/src/index.js */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
  module.exports = require('./lib/browser.js');
} else {
  module.exports = require('./lib/node.js');
}
