# configucius
[![npm](https://img.shields.io/npm/v/configucius.svg)](https://www.npmjs.com/package/configucius)

A config with prompt and read/save-to-file capabilities.

```js
const Config = require('configucius')

const config = new Config()

config.get('someConfig')
config.set('someConfig', 'value')
```
