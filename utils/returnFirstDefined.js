
module.exports = (args) => {
  for (const arg of args) {
    if (typeof arg !== 'undefined') {
      return arg
    }
  }
}
