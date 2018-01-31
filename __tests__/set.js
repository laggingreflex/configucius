const Config = require('..')

describe('set', () => {
  it('should set with .get(key, value)', async() => {
    const config = new Config()
    config.set('a', 'a')
    config.get('a').should.equal('a')
  })
  describe('input type as string', () => {
    it('should throw when non-string', () => {
      const config = new Config({
        options: { a: {type: 'input'} }
      })
      ;(() => config.set('a', 1)).should.throw()
    })
    it('should set when string', () => {
      const config = new Config({
        options: { a: {type: 'input'} }
      })
      config.set('a', 'a')
      config.get('a').should.equal('a')
    })
  })
  describe('input type as string', () => {
    it('should throw when non-string', () => {
      const config = new Config({
        options: { a: {type: 'password'} }
      })
      ;(() => config.set('a', 1)).should.throw()
    })
    it('should set when string', () => {
      const config = new Config({
        options: { a: {type: 'password'} }
      })
      config.set('a', 'a')
      config.get('a').should.equal('a')
    })
  })
  describe('input type as boolean', () => {
    it('should throw when non-boolean', () => {
      const config = new Config({
        options: { a: {type: 'boolean'} }
      })
      ;(() => config.set('a', 1)).should.throw()
    })
    it('should set when boolean', () => {
      const config = new Config({
        options: { a: {type: 'boolean'} }
      })
      config.set('a', true)
      config.get('a').should.equal(true)
    })
  })
  describe('input type as array', () => {
    it('should throw when non-array', () => {
      const config = new Config({
        options: { a: {type: 'array'} }
      })
      ;(() => config.set('a', 1)).should.throw()
    })
    it('should set when array', () => {
      const config = new Config({
        options: { a: {type: 'array'} }
      })
      config.set('a', [true])
      config.get('a').should.deep.equal([true])
    })
  })
  describe('input type as un-identified', () => {
    it('should throw', () => {
      const config = new Config({
        options: { a: {type: 'un-identified'} }
      })
      ;(() => config.set('a', 1)).should.throw()
    })
  })
  describe('key not declared as a setting', () => {
    it('should throw when setOnlyDefined=true', () => {
      const config = new Config({
        setOnlyDefined: true
      })
      ;(() => config.set('a', 1)).should.throw()
    })
    it('should set when setOnlyDefined=false', () => {
      const config = new Config()
      config.set('a', 1)
      config.get('a').should.equal(1)
    })
  })
})
