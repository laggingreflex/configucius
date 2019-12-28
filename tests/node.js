const sinon = require('sinon');
const _ = require('./utils');
const Config = require('../lib/node');

describe('loadSaved', () => {
  const { fs } = _.mock({
    fs: {
      existsSync: sinon.stub(),
      readFileSync: sinon.stub(),
    },
    // fs: sinon.stub(require('fs')),
    console: _.consoleMock,
    require(){
      console.log('???');
    },
  });

  it(`File doesn't exist`, () => {
    fs.existsSync.returns(false);
    Config.prototype.loadSaved.call({
      constructor: { cwd: 'cwd' },
      path: 'path',
    });
    sinon.assert.calledWith(fs.existsSync, sinon.match(/cwd.*path/));
    sinon.assert.notCalled(fs.readFileSync);
    sinon.assert.calledWith(console.warn, sinon.match(/cwd.*path.*exist/));
  });

  it(`Valid JSON`, () => {
    fs.existsSync.returns(true);
    fs.readFileSync.returns(JSON.stringify({ a: 1 }));
    const load = sinon.spy()
    Config.prototype.loadSaved.call({
      constructor: { cwd: 'cwd' },
      path: 'path',
      load,
    });
    sinon.assert.calledWith(fs.existsSync, sinon.match(/cwd.*path/));
    sinon.assert.notCalled(console.warn);
    sinon.assert.calledWith(load, sinon.match({ a: 1 }));
  });

  it(`Invalid JSON`, () => {
    fs.existsSync.returns(true);
    fs.readFileSync.returns('a');
    Config.prototype.loadSaved.call({
      constructor: { cwd: 'cwd' },
      path: 'path',
    });
    sinon.assert.calledWith(fs.existsSync, sinon.match(/cwd.*path/));
    sinon.assert.calledWith(console.warn, sinon.match(/cwd.*path.*JSON/));
  });

  it.skip(`Valid JS`, () => {
    fs.existsSync.returns(true);
    fs.readFileSync.returns('module.exports = {a: 1}');
    const load = sinon.spy()
    Config.prototype.loadSaved.call({
      constructor: { cwd: 'cwd' },
      path: 'path',
      load,
    });
    console.log(`fs.readFileSync.callCount:`, fs.readFileSync.callCount);
    sinon.assert.calledWith(fs.existsSync, sinon.match(/cwd.*path/));
    sinon.assert.calledWith(fs.readFileSync, sinon.match(/cwd.*path/));
    sinon.assert.notCalled(console.warn);
    sinon.assert.calledWith(load, sinon.match({ a: 1 }));
  });

});
