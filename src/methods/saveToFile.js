import fs from 'fs-promise'

export default async (silent) => {
  const config = this

  for (const key in config) {
    if (config.propertyIsEnumerable(key) && !(config[key] && config[key].length)) { delete config[key] }
  }

  try {
    await fs.outputFile(config.configFile, JSON.stringify(config, null, 2))
  } catch (error) {
    throw new Error(`Couldn't save to file "${config.configFile}". ` + error.message)
  }
  silent || console.log(`Config saved successfully to file "${config.configFile}"`)
  return config
}
