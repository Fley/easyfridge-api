const supertest = require('supertest');
const {expect} = require('chai')

const {getApp, testuser, getDatasource} = require('../../test/setup')

describe('Endpoint /authentication', () => {
  describe('POST /authentication', () => {

    it('should respond with a token when given an existing user and correct password', function(done) {
      supertest(getApp())
        .post('/authentication')
        .send({email: testuser.email, password: testuser.password})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          expect(res).to.have.authenticationToken
          expect(res.body).to.have.property('token')
          expect(res.body.token).to.be.a('string')
          expect(res.body.token).to.match(/^[^\.]+\.[^\.]+\.[^\.]+$/)
          done()
        })
    })

    it('should respond with 401 when given an unknown user', function(done) {
      supertest(getApp())
        .post('/authentication')
        .send({email: 'georges@denbrough.it', password: 'password'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          expect(res).to.not.have.authenticationToken
          expect(res.body).to.not.have.property('token')
          done()
        })
    })

    it('should respond with 401 when given an existing user with incorrect password', function(done) {
      supertest(getApp())
        .post('/authentication')
        .send({email: testuser.email, password: 'clearly an incorrect password'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          expect(res).to.not.have.authenticationToken
          expect(res.body).to.not.have.property('token')
          done()
        })
    })

  })
})
