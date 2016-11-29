import Config from '../src'

describe('get', () => {
  it('should get with .get()', async() => {
    const config = new Config()
    config.set('a', 'a')
    config.get('a').should.equal('a')
  })
})
