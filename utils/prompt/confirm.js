import Enquirer from 'enquirer'
import Confirm from 'prompt-confirm'

const enquirer = new Enquirer()

enquirer.register('confirm', Confirm)

export default async(message, def) => {
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
