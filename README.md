# configucius

A config with prompt and read/save-to-file capabilities.

## Install


```
npm install configucius
```

## Usage

```js
const Config = require('configucius')

const config = new Config({ path: '~/config.json' })
config.$load('~/config.json')
config.$load({ key: 'value' })

config.key // => 'value'

await config.$prompt('key') // => Prompts for "key"

config.$save() // saves to `~/config.json`
```
