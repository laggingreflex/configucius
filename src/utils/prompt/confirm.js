import Enquirer from 'enquirer'
import Confirm from 'prompt-confirm'

const enquirer = new Enquirer()

enquirer.register('confirm', Confirm)

export default async(message, def) => {
  return (await enquirer.prompt({
    name: 'confirm',
    type: 'confirm',
    default: def || false,
    message: message + ':'
  })).confirm
}
