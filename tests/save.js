import Save from '../src/methods/save'
import Read from '../src/methods/readConfigFile'
import { stub } from 'sinon'
import JSON from 'json5'
import Config from '../src'
import path from 'path'
import untildify from 'untildify'

describe('save', () => {
  let fs = {}
  beforeEach(() => {
    fs.write = fs.outputFile = stub()
    fs.read = fs.readFileSync = stub()
    Save.__Rewire__('fs', fs)
    Read.__Rewire__('fs', fs)
  })
  afterEach(() => {
    Save.__ResetDependency__('fs')
    Read.__ResetDependency__('fs')
  })
  const configFile = 'configFile'

  it('should throw when theres no configFile setting', async() => {
    fs.read.throws()
    const config = new Config()
    delete config.config.configFile
    delete config.config.name
    return config.save().should.be.rejectedWith(/configFile/)
  })

  it('should save empty config when no previously saved config exists', async() => {
    fs.read.throws()
    const config = new Config({
      configFile
    })
    await config.save()
    fs.write.should.have.been.calledWithMatch('configFile')
  })

  it('should not save empty config when previously saved config exists', async() => {
    fs.read.returns(JSON.stringify({a: 1}))
    const config = new Config({
      configFile
    })
    return config.save().should.be.rejectedWith(/fewer/)
  })

  it('should save config that changes previously saved config', async() => {
    fs.read.returns(JSON.stringify({a: 1}))
    const config = new Config({
      options: {a: {save: true}},
      configFile
    })
    config.set('a', 2)
    await config.save()
    fs.write.should.be.calledWith(configFile)
    JSON.parse(fs.write.args[0][1]).should.deep.equal({a: 2})
  })

  it('should save config that adds to previously saved config', async() => {
    fs.read.returns(JSON.stringify({a: 1}))
    const config = new Config({
      options: {
        a: {save: true},
        b: {save: true}
      },
      configFile
    })
    config.set('b', 2)
    await config.save()
    fs.write.should.be.calledWith(configFile)
    JSON.parse(fs.write.args[0][1]).should.deep.equal({a: 1, b: 2})
  })

  it('should not save config that removes from previously saved config', async() => {
    fs.read.returns(JSON.stringify({a: 1, b: 2}))
    const config = new Config({
      options: {
        a: {save: true},
        b: {save: true}
      },
      configFile
    })
    config.unset('b')
    return config.save().should.be.rejectedWith(/fewer/)
  })

  it('should save config that removes from previously saved config with {saveLossy}', async() => {
    fs.read.returns(JSON.stringify({a: 1, b: 2}))
    const config = new Config({
      options: {
        a: {save: true},
        b: {save: true}
      },
      configFile,
      saveLossy: true
    })
    config.unset('b')
    await config.save()
  })

  it('should not save config that adds to previously saved config with {saveStrict}', async() => {
    fs.read.returns(JSON.stringify({a: 1}))
    const config = new Config({
      options: {
        a: {save: true},
        b: {save: true}
      },
      configFile,
      saveStrict: true
    })
    config.set('b', 2)
    return config.save().should.be.rejectedWith(/more/)
  })
  it('should not save config that removes from previously saved config with {saveStrict}', async() => {
    fs.read.returns(JSON.stringify({a: 1, b: 2}))
    const config = new Config({
      options: {
        a: {save: true},
        b: {save: true}
      },
      configFile,
      saveStrict: true
    })
    config.unset('b')
    return config.save().should.be.rejectedWith(/fewer/)
  })

  it('should throw when saving fails', async() => {
    fs.read.returns('{}')
    const config = new Config({
      configFile
    })
    fs.write.throws(new Error('cannot save'))
    return config.save().should.be.rejectedWith('cannot save')
  })

  it('should save to Config({configFile: /arbitrary/location})', async() => {
    fs.read.returns('{}')
    const config = new Config({configFile: '/arbitrary/location'})
    await config.save()
    fs.write.should.have.been.calledWithMatch('/arbitrary/location')
  })
  it('should save to config.set(configFile, /arbitrary/location)', async() => {
    const config = new Config()
    config.set('configFile', '/arbitrary/location')
    await config.save()
    fs.write.should.have.been.calledWithMatch('/arbitrary/location')
  })
  it('should save to ~/.[name]', async() => {
    const config = new Config()
    config.set('name', 'name')
    await config.save()
    fs.write.should.have.been.calledWithMatch(untildify(path.join('~', '.name')))
  })
  it('should prefer saving to configFile over ~/.[name]', async() => {
    const config = new Config()
    config.set('name', 'name')
    config.set('configFile', '/arbitrary/location')
    await config.save()
    fs.write.should.have.been.calledWithMatch('/arbitrary/location')
  })
  it('should prefer saving to set(configFile) over new(configFile) & ~/.[name]', async() => {
    fs.read.returns('{}')
    const config = new Config({configFile: '/arbitrary/location1'})
    config.set('name', 'name')
    config.set('configFile', '/arbitrary/location2')
    await config.save()
    fs.write.should.have.been.calledWithMatch('/arbitrary/location2')
  })
})
