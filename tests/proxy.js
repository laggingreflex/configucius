import Config from '../src'

describe.only('proxy', () => {
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
  describe.only('set', () => {
    it('should set a setting if its defined in options', async() => {
      const config = new Config({ options: { a: {} } })
      config.a = 'a';
      (typeof config.a).should.equal('undefined')
      config.get('a').should.equal('a')
    })
    it('should set a direct key if its not defined in options', async() => {
      const config = new Config()
      config.a = 'a'
      config.should.have.a.property('a');
      (typeof config.get('a')).should.equal('undefined')
    })
  })
})
