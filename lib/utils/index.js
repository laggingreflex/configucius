const _ = exports;

_.arrify = array => Array.isArray(array) ? array : array === undefined ? [] : [array];
_.define = (object, key, descriptor) => Object.defineProperty(object, key, { enumerable: false, configurable: true, ...descriptor });
