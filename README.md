# configucius
[![npm](https://img.shields.io/npm/v/configucius.svg)](https://www.npmjs.com/package/configucius)

A wrapper around [yargs] with prompt and read/save-to-file capabilities.

```js
import Config from 'configucius'

const config = new Config({
    configFile: '~/.yourPackageName',
    options: { // yargs' .options()
        someConfig: {
            type: 'string'
        }
    }
})

// $ your-cli --some-config=value # pass it as args
// $ SOME_CONFIG=value your-cli   # or env variable

config.get('someConfig')
```

With `prompt` built in

```js
await config.prompt('someConfig')

// prompts the user
// $ your-cli
// $ Enter Some config: value

config.get('someConfig')
```

Read and save the config to a file (default `~/.your-package-name`)

```
await config.save()
```

[yargs]: https://www.npmjs.com/package/yargs
