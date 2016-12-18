import Prompt from '../src/methods/prompt'
import { stub } from 'sinon'
import Config from '../src'

describe('prompt', () => {
  let prompt
  beforeEach(() => {
    prompt = stub()
    Prompt.__Rewire__('prompt', { input: prompt, confirm: prompt, password: prompt })
  })
  afterEach(() => {
    Prompt.__ResetDependency__('prompt')
  })

  describe('for missing args', () => {
    it('should prompt for args that have prompt property', async() => {
      const config = new Config({
        options: { a: { prompt: 'a' } }
      })
      prompt.returns(Promise.resolve('b'))
      await config.prompt()
      prompt.should.have.been.calledOnce
      prompt.should.have.been.calledWith('a')
      config.a.should.equal('b')
    })
    it('should not prompt if no appropriate args are found', async() => {
      const config = new Config()
      await config.prompt()
      prompt.should.not.have.been.called
    })
    it('should only prompt for missing', async() => {
      const config = new Config({
        options: {
          a: { prompt: 'a' },
          b: { prompt: 'b' }
        }
      })
      config.a = 1
      prompt.returns(Promise.resolve(2))
      await config.prompt({missing: true})
      prompt.should.have.been.calledOnce
      prompt.should.have.been.calledWith('b')
      config.b.should.equal(2)
    })
    it('should only prompt for all', async() => {
      const config = new Config({
        options: {
          a: { prompt: 'a' },
          b: { prompt: 'b' }
        }
      })
      config.a = 1
      prompt.returns(Promise.resolve(0))
      await config.prompt({all: true})
      prompt.should.have.been.calledTwice
      prompt.should.have.been.calledWith('a')
      prompt.should.have.been.calledWith('b')
      config.a.should.equal(0)
      config.b.should.equal(0)
    })
  })

  describe('for specific args', () => {
    it('should only prompt for specific args', async() => {
      const config = new Config({
        options: {
          a: { prompt: 'a' },
          b: { prompt: 'b' }
        }
      })
      prompt.returns(Promise.resolve(1))
      await config.prompt('a')
      prompt.should.have.been.calledOnce
      prompt.should.have.been.calledWith('a')
      config.a.should.equal(1)
    })
  })

  describe('with these messages', () => {
    it('should display startcase keyname when prompt key value is boolean', async() => {
      const config = new Config({
        options: { someKey: { prompt: true } }
      })
      prompt.returns(Promise.resolve(1))
      await config.prompt()
      prompt.should.have.been.calledWith('Some key')
    })
    it('should display prompt key value when string', async() => {
      const config = new Config({
        options: { someKey: { prompt: 'true' } }
      })
      prompt.returns(Promise.resolve(1))
      await config.prompt()
      prompt.should.have.been.calledWith('true')
    })
    it('should display description', async() => {
      const config = new Config({
        options: { someKey: { prompt: 'true', description: 'des' } }
      })
      prompt.returns(Promise.resolve(1))
      await config.prompt()
      prompt.should.have.been.calledWith('des')
    })
    it('should display message', async() => {
      const config = new Config({
        options: { someKey: { prompt: 'true', description: 'des', message: 'mess' } }
      })
      prompt.returns(Promise.resolve(1))
      await config.prompt()
      prompt.should.have.been.calledWith('mess')
    })
  })

  describe('infer prompt method type', () => {
    let input, confirm, password
    beforeEach(() => {
      input = stub()
      confirm = stub()
      password = stub()
      Prompt.__Rewire__('prompt', { input, confirm, password })
    })
    afterEach(() => {
      Prompt.__ResetDependency__('prompt')
    })
    it('should call confirm with boolean', async() => {
      const config = new Config({
        options: { someKey: { prompt: true, type: 'boolean' } }
      })
      confirm.returns(Promise.resolve(true))
      await config.prompt()
      confirm.should.have.been.called
    })
    it('should call password with password', async() => {
      const config = new Config({
        options: { someKey: { prompt: true, type: 'password' } }
      })
      password.returns(Promise.resolve('password'))
      await config.prompt()
      password.should.have.been.called
    })
  })
})
