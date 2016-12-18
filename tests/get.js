import Config from '../src'

describe('get', () => {
  it('should get with .get(key)', async() => {
    const config = new Config()
    config.set('a', 'a')
    config.get('a').should.equal('a')
  })
  it('should get all with .get()', async() => {
    const config = new Config()
    config.set('a', 1)
    config.get().should.like({a: 1})
  })
})
