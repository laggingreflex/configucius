export default function () {
  const config = this

  config.env = config.parseWithYargs(yargs => yargs.env().parse([]))
}
