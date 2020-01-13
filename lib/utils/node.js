const OS = require('os');
const Path = require('path');

const homedir = OS.homedir();
const cwd = process.cwd();

const _ = exports;

_.adjustPath = (path, { cwd: cwd_ = cwd, homedir: homedir_ = homedir, ...rest } = {}) => {
  path = String(path);
  // if (typeof path !== 'string') throw new TypeError(`Expected a 'string', got '${typeof path}'`);
  path = path.replace('<cwd>', cwd_);
  path = homedir_ ? path.replace(/^~(?=$|\/|\\)/, homedir_) : path;
  if (cwd_ && !Path.isAbsolute(path)) path = Path.join(cwd_, path);
  for (const key in rest) {
    const replace = rest[key];
    const regex = new RegExp(`<${key}>`, 'ig');
    path = path.replace(regex, replace);
  }
  path = Path.join(path);
  return path;
};
