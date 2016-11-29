import Config from '../src'

describe('basic', () => {
  it('should be a function', () => {
    Config.should.be.a('function')
  })
  it('should not throw', () => {
    Config.should.not.throw
  })
  it('should return an object', () => {
    const config = new Config()
    config.should.be.an('object')
  })
})
