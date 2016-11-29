import chai from 'chai'
import sinon from 'sinon-chai'
import like from 'chai-like'
import promise from 'chai-as-promised'

// chai
chai.use(sinon)
chai.use(like)
chai.use(promise)
chai.should()
