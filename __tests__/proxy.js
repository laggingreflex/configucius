const Config = require('..')

describe('proxy', () => {
  describe('get', () => {
    it('for a setting of the same name, it should get the property', async() => {
      const config = new Config()
      const get = config.get
      config.set('get', 'a')
      config.get.should.equal(get)
    })
    it('should get() a setting', async() => {
      const config = new Config()
      config.set('a', 'a')
      config.a.should.equal('a')
    })
  })
  describe('set', () => {
    it('should set a setting if its defined in options', async() => {
      const config = new Config({ options: { a: {} } })
      config.a = 'a'
      config.should.not.have.a.property('a')
      config.get('a').should.equal('a')
    })
    it('should set a direct key if its not defined in options', async() => {
      const config = new Config()
      config.a = 'a'
      config.should.have.a.property('a')
      const a = typeof config.get('a')
      a.should.equal('undefined')
    })
  })
})
