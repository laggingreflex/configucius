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

  it('should prompt for missing args', async() => {
    const config = new Config({
      options: { a: { prompt: 'a' } }
    })
    prompt.returns(Promise.resolve('b'))
    await config.prompt()
    prompt.should.have.been.called
    config.a.should.equal('b')
  })
  it('should prompt for missing args', async() => {
    const config = new Config({
      options: { a: { description: 'a' } }
    })
    prompt.returns(Promise.resolve('b'))
    await config.prompt('a')
    prompt.should.have.been.called
    config.a.should.equal('b')
  })
  it('should prompt for missing args', async() => {
    const config = new Config({
      options: { a: { message: 'a' } }
    })
    prompt.returns(Promise.resolve('b'))
    await config.prompt('a')
    prompt.should.have.been.called
    config.a.should.equal('b')
  })
  it('should prompt for missing args', async() => {
    const config = new Config({
      options: { a: {} }
    })
    prompt.returns(Promise.resolve('b'))
    await config.prompt('a')
    prompt.should.have.been.called
    config.a.should.equal('b')
  })
  it('should prompt for missing args', async() => {
    const config = new Config({
      options: { a: {type: 'boolean'} }
    })
    prompt.returns(Promise.resolve('b'))
    await config.prompt('a')
    prompt.should.have.been.called
    config.a.should.equal('b')
  })
  it('should prompt for missing args', async() => {
    const config = new Config({
      options: { a: {type: 'password'} }
    })
    prompt.returns(Promise.resolve('b'))
    await config.prompt('a')
    prompt.should.have.been.called
    config.a.should.equal('b')
  })
})
