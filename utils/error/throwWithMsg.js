module.exports = (msg, err, extras) => {
  if (err) {
    err.message = msg + err.message
  } else {
    extras = err
    err = new Error(msg)
  }
  Object.assign(err, extras)
  throw err
}
