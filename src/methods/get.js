export default function (key) {
  const config = this
  return config.config[key] || config.getFromArgs(key) || config.getFromFile(key)
}
