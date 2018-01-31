const chai = require('chai')
const sinon = require('sinon-chai')
const like = require('chai-like')
const promise = require('chai-as-promised')

// chai
chai.use(sinon)
chai.use(like)
chai.use(promise)
chai.should()
