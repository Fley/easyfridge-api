const supertest = require('supertest')
const { createApi, startApi } = require('../')
const chai = require('chai')
const logger = require('../../logger')

const { MongoClient } = require('mongodb')
const MongoInMemory = require('mongo-in-memory')
const { USERS } = require('../../database').COLLECTIONS
const dbname = 'easyfridge-test'
const dbport = 9004

let mongoInMemory
let datasource
let app
let server

before(function(done) {
  chai.use(function (_chai, utils) {
    chai.Assertion.addProperty('authenticationToken', function () {
      var res = utils.flag(this, 'object')
      if(utils.flag(this, 'negate')) {
        new chai.Assertion(res.headers).to.not.have.property('x-auth-token')
      } else {
        new chai.Assertion(res.headers).to.have.property('x-auth-token')
        new chai.Assertion(res.headers['x-auth-token']).to.match(/^[^\.]+\.[^\.]+\.[^\.]+$/)
      }
    })
  })

  mongoInMemory = new MongoInMemory(dbport)
  mongoInMemory.start((error, config) => {
    logger.log('Mongo in memory server started')
    if (error) {
      logger.error(error)
    } else {
      MongoClient.connect(mongoInMemory.getMongouri(dbname)).then(db => {
        logger.log('Connected to in memory mongo')
        if (error) {
          logger.error(error)
        } else {
          datasource = db
          app = createApi({datasource})
          server = startApi(app)
          done()
        }
      })
    }
  })
})

beforeEach(function(done) {
  datasource.dropDatabase().then(() => {
    logger.verbose('Dropped test database')
    const user = datasource.collection(USERS)
    user.insertOne(testuser)
      .then(() => user.insertOne(testadminuser))
      .then(() => done())
      .catch(e => logger.error(e))
  })
})

afterEach(function() {
})

after(function(done) {
  try {
    server.close()
  } catch (e) {
    logger.error(e)
  }
  mongoInMemory.stop((error) => {
    if (error) {
      logger.error(error)
    }
    done()
  })
})

const testuser = {
  _id: 42,
  id: 'bdenbrough',
  email: 'bill@denbrough.it',
  name: 'Bill Denbrough',
  password: 'password',
  authorizations: []
}
const testadminuser = {
  _id: 73,
  id: 'mhanlon',
  email: 'mike@hanlon.it',
  name: 'Mike Hanlon',
  password: 'password',
  authorizations: ['role_admin']
}

const getAuthenticationToken = () => {
  return getAuthenticationTokenForUser({datasource, app})(testuser)
}

const getAdminAuthenticationToken = () => {
  return getAuthenticationTokenForUser({datasource, app})(testadminuser)
}

const getAuthenticationTokenForUser = ({datasource, app}) => user => {
  return supertest(app)
    .post('/authentication')
    .send({email: user.email, password: user.password})
    .set('Accept', 'application/json')
    .then(res => res.body.token)
}

module.exports = {
  getApp: () => app,
  getDatasource: () => datasource,
  testuser,
  testadminuser,
  getAuthenticationToken,
  getAdminAuthenticationToken
}
