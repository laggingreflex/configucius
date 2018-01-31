module.exports = (errors) => {
  if (errors instanceof Array) {
    console.error(`
      Errors:
        ${errors.join('\n      ')}
    `);
  } else {
    console.error(`
      Error: ${error}
    `);
  }
  process.exit(1);
}
