const supertest = require('supertest')
const {expect} = require('chai')
const sinon = require('sinon')
require('sinon-as-promised')

const {
  getApp,
  getDatasource,
  testuser,
  testadminuser,
  getAuthenticationToken,
  getAdminAuthenticationToken
} = require('../../test/setup')

const userKeys = ['id', 'email', 'name', 'authorizations']

describe('Endpoint /user', () => {

  describe('POST /user', () => {

    it('should return 201 and the created user json', function(done) {
      const newuser = {
        id: 'bmarsh',
        email: 'beverly@marsh.it',
        name: 'Beverly Marsh',
        password: 'bev'
      }
      supertest(getApp())
        .post('/user')
        .set('Accept', 'application/json')
        .send(newuser)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).to.have.all.keys(userKeys)
          expect(res.body).to.deep.equals({
            id: newuser.id,
            email: newuser.email,
            name: newuser.name,
            authorizations: []
          })
        })
        .expect(201, done)
    })

    it('should return 409 when given an already existing user email', function(done) {
      const newuser = {
        id: 'gdenbrough',
        email: testuser.email,
        name: 'Georges Denbrough',
        password: 'boat'
      }
      supertest(getApp())
        .post('/user')
        .set('Accept', 'application/json')
        .send(newuser)
        .expect('Content-Type', /json/)
        .expect(409, done)
    })

    it('should return 400 when given an incorrect payload', function(done) {
      throw new Error('Not implemented')
    })

  })

  describe('GET /user', () => {

    it('should return 200 and the requested page of users when authenticated as administrateur', function(done) {
      throw new Error('Not implemented')
    })

    it('should return 403 when NOT authenticated as administrateur', function(done) {
      throw new Error('Not implemented')
    })

    it('should return 401 when NOT authenticated', function(done) {
      throw new Error('Not implemented')
    })

  })

  describe('GET /user/:id', () => {

    it('should respond 200 with json when authUser is calling its own id', function(done) {
      getAuthenticationToken().then(token => {
        const user = JSON.parse(JSON.stringify(testuser))
        const expectedUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          authorizations: user.authorizations
        }
        supertest(getApp())
          .get('/user/' + user.id)
          .set('Accept', 'application/json')
          .set('x-auth-token', token)
          .expect('Content-Type', /json/)
          .expect(res => {
            expect(res).to.have.authenticationToken
            expect(res.body).to.have.all.keys(userKeys)
            expect(res.body).to.deep.equals(expectedUser)
          })
          .expect(200, done)
      }).catch(err => console.log(err))
    })

    it('should respond 200 with json when authUser is an admin', function(done) {
      getAdminAuthenticationToken().then(token => {
        const user = JSON.parse(JSON.stringify(testuser))
        const expectedUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          authorizations: user.authorizations
        }
        supertest(getApp())
          .get('/user/' + user.id)
          .set('Accept', 'application/json')
          .set('x-auth-token', token)
          .expect('Content-Type', /json/)
          .expect(res => {
            expect(res).to.have.authenticationToken
            expect(res.body).to.have.all.keys(userKeys)
            expect(res.body).to.deep.equals(expectedUser)
          })
          .expect(200, done)
      }).catch(err => console.log(err))
    })

    it('should respond 404 when authUser is an admin and getting an unknown user', function(done) {
      getAdminAuthenticationToken().then(token => {
        supertest(getApp())
          .get('/user/dduck')
          .set('Accept', 'application/json')
          .set('x-auth-token', token)
          .expect('Content-Type', /json/)
          .expect(res => {
            expect(res).to.not.have.authenticationToken
          })
          .expect(404, done)
      }).catch(err => console.log(err))
    })

    it('should respond 401 when not authenticated', function(done) {
      const user = JSON.parse(JSON.stringify(testuser))
      supertest(getApp())
        .get('/user/' + user.id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .expect(res => {
          expect(res).to.not.have.authenticationToken
        })
        .expect(401, done)
    })

    it('should respond 403 when trying to get another user than authenticated', function(done) {
      getAuthenticationToken().then(token => {
        const user = {
          _id: 1,
          id: 'ekaspbrak',
          email: 'eddie@kaspbrak.it',
          name: 'Eddie Kaspbrak',
          password: 'hydrox'
        }
        supertest(getApp())
          .get('/user/' + user.id)
          .set('Accept', 'application/json')
          .set('x-auth-token', token)
          .expect('Content-Type', /json/)
          .expect(res => {
            expect(res).to.not.have.authenticationToken
          })
          .expect(403, done)
      }).catch(err => console.log(err))
    })

    it('should respond 500 when something fucked up', function(done) {
      getAuthenticationToken().then(token => {
        const stub = sinon.stub(getDatasource(), 'collection')
        stub.withArgs(require('../../../database').COLLECTIONS.USERS)
          .rejects('A very good reason to fail')
        supertest(getApp())
          .get('/user/' + testuser.id)
          .set('Accept', 'application/json')
          .set('x-auth-token', token)
          .expect(res => stub.restore())
          .expect('Content-Type', /json/)
          .expect(res => {
            expect(res).to.not.have.authenticationToken
          })
          .expect(500, done)
      }).catch(err => console.log(err))
    })

  })

  describe('PATCH /user', () => {

  })

  describe('DELETE /user', () => {

  })

})
