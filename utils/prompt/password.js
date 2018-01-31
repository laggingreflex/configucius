const Enquirer = require('enquirer')
const Password = require('prompt-password')

const enquirer = new Enquirer()

enquirer.register('password', Password)

export default async(message, def) => {
  return (await enquirer.prompt({
    name: 'password',
    type: 'password',
    message: message + ':'
  })).password
}
