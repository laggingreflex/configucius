const Enquirer = require('enquirer')
const Confirm = require('prompt-confirm')

const enquirer = new Enquirer()

enquirer.register('confirm', Confirm)

module.exports = async(message, def) => {
  const answer = (await enquirer.prompt({
    name: 'confirm',
    type: 'confirm',
    default: def || false,
    message: message + ':'
  })).confirm;
  if (!answer && def === undefined) {
    return
  } else {
    return answer
  }
}
