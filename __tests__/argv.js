const Config = require('..')

describe('argv', () => {
  it('should remove redundant aliases', () => {
    const config = new Config({
      options: {
        someConfig: { alias: ['a'] },
        someOther: {}
      }
    })
    config.processArgv('-a 1 --some-other 2')
    config.args.should.be.like({ someConfig: 1 })
    config.args.should.not.be.like({ a: 1 })
    config.args.should.be.like({ someOther: 2 })
  })
  describe('duplicateArgumentsArray', () => {
    it('should remove duplicates', () => {
      const config = new Config({
        duplicateArgumentsArray: false,
        options: { x: {} }
      })
      config.processArgv('-x a -x b -x c')
      config.args.should.be.like({ x: 'c' })
    })
    it('should not remove duplicates', () => {
      const config = new Config({
        duplicateArgumentsArray: true,
        options: { x: {} }
      })
      config.processArgv('-x a -x b -x c')
      config.args.should.be.like({ x: ['a', 'b', 'c'] })
    })
  })
})
