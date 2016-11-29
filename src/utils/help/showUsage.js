export default () => {
  console.log(`
    Usage:
      gfork <url>
    Options:
      -u, --url       GitHub URL to fork    [required]
      -t, --token     GitHub auth token
      -u, --username  GitHub username
      -p, --password  GitHub password
  `)
}
