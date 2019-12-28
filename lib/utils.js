const lodash = require('lodash');

const _ = exports;

_.constants = {
  start: +new Date,
  minute: 60,
  hour: 3600,
  day: 86400,
};

_.MergeError = class MergedError extends Error {
  constructor(...errors) {
    super();
    Object.defineProperty(this, 'errors', { get: () => errors });
    let stack, message;
    Object.defineProperty(this, 'message', { get: () => message || '' });
    Object.defineProperty(this, 'stack', { get: () => stack || '' });
    for (const error of errors) {
      if (error.stack) stack = error.stack
      message = error.message || error;
    }
    // console.log({ message, stack });

    // // ['string', Error('aa')]
    // let last;
    // for (let current of errors) {
    //   // console.log({ error: last, e: current });
    //   if (typeof current === 'string') {
    //     current = { message: current };
    //   }
    //   if (last) {
    //     current.message = last.message + ' ' + current.message;
    //     if (current.stack && last.stack) {
    //       current.stack = last.stack + ' ' + current.stack;
    //     }
    //   }
    //   last = current;
    //   // if (last) {
    //   //   error.message = (last && error.message || error) + ' ' + error.message;
    //   //   error.stack = (last && error.stack || error) + ' ' + error.stack;
    //   // }
    //   // last = error;
    // }
    // Object.defineProperty(this, 'errors', { get: () => errors });
    // // this.errors = errors;
  }
};
_.UserError = class UserError extends Error {};
_.mError = (prefix, error) => {
  error.message = prefix + error.message;
  error.stack = prefix + error.stack;
  return error;
}

_.debounce = lodash.debounce;

_.noop = (...args) => {};

_.arrify = array => Array.isArray(array) ? array : array === undefined ? [] : [array];

_.flat = lodash.flattenDeep;
_.flatMap = lodash.flatMapDeep;

_.promise = cb => new Promise(async (resolve, reject) => {
  try {
    resolve(await cb());
  } catch (error) {
    reject(error);
  }
});

_.delay = (timeout = 1000) => new Promise((resolve) => setTimeout(resolve, timeout));
_.race = (promises, timeout = 1000) => Promise.race([..._.arrify(promises), _.delay(timeout)]);

_.try = (fn, onError = _.noop) => {
  try {
    const result = fn();
    if (result instanceof Promise) {
      return result.catch(onError)
    } else return result;
  } catch (error) {
    return onError(error);
  }
};

_.tryParse = thing => {
  try {
    return JSON.parse(thing);
  } catch (error) {
    return thing;
  }
}
_.tryAssign = (...args) => {
  try {
    return Object.assign(...args);
  } catch (error) {
    return args.pop();
  }
}
_.stringify = thing => typeof thing === 'string' ? thing : JSON.stringify(thing);

_.copy = thing => JSON.parse(JSON.stringify(thing));

_.Queue = class extends Set {
  run() {
    return Promise.all(Array.from(this).map(task => {
      this.delete(task);
      return _.try(task);
    }));
  }
};

_.patch = (object, method, patch) => {
  const originalMethod = object[method] ? object[method].bind(object) : () => {};
  object[method] = patch.bind(object, originalMethod);
  return object;
};

_.proxy = (object, override) => new Proxy(object, { get: (x, key, receiver) => typeof override === 'function' ? override(x, key, receiver) : override[key] || object[key] });

_.eventualProxy = (object) => new Proxy(object, {
  get: (x, method) => (...args) => object.then(object => object[method](...args))
});

_.now = () => +new Date;

_.from = (start = _.constants.start) => {
  const from = Math.round((_.now() - start) / 1000);
  if (from < _.constants.minute) {
    return from + 's';
  } else if (from < _.constants.hour) {
    return Math.round(from / _.constants.minute) + 'm';
  } else if (from < _.constants.day) {
    return Math.round(from / _.constants.hour) + 'h' + Math.round(from % _.constants.hour) + 'm';
  }
}

_.name = (object, name) => {
  const Class = class {};
  const instance = new Class;
  Object.defineProperty(Class, 'name', { get: () => name });
  return Object.assign(instance, object);
}
