import Enquirer from 'enquirer'

const enquirer = new Enquirer()

export default async(message, def) => {
  return (await enquirer.prompt({
    name: 'input',
    message: message + ':',
    default: def
  })).input
}
