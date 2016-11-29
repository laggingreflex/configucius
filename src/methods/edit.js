import isEmpty from 'is-empty'

export default async function () {
  const config = this

  if (config.editConfig) {
    const passedArgs = Object.keys(config.args).filter(arg => !isEmpty(config.args[arg]) && Object.keys(config).includes(arg))
    if (passedArgs.length) {
      for (const arg of passedArgs) {
        await config.editOne(arg); // eslint-disable-line
      }
      await config.saveToFile()
      return
    }
  }

  if (!config.token && !await this.editOne('tokenNote')) {
    await this.editOne('token')
  }
  if (config.forksDir) {
    await this.editOne('forksDir', 'Directory to put new forks in:')
    await this.editOne('command', 'Command to run in forksDir after cloning:')
  } else {
    await this.editOne('command', 'Command to run after cloning:')
    await this.editOne('forksDir', 'Directory to put new forks in:')
  }
  if (config.command) {
    if (config.forksDir) {
      await this.editOne('currentDirCommand', 'Command to run in current dir after forksDir command:')
    } else {
      await this.editOne('currentDirCommand', 'Command to run in current dir:')
    }
  }

  // await this.editOne('tokenNote', 'Token note:');
  await this.editOne('remote', 'Name for original remote:')
  await this.editOne('domain', 'Domain name:')
  await this.editOne('urlType', 'Github URL type:')

  // await this.editOne('username', 'Your username:');

  await config.saveToFile()
  return config
}
