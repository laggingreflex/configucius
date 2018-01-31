const Enquirer = require('enquirer')

const enquirer = new Enquirer()

module.exports = async(message, def) => {
  return (await enquirer.prompt({
    name: 'input',
    message: message + ':',
    default: def
  })).input
}
