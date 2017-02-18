const express = require('express')
const ERRORS = require('../errors')
const logger = require('../../logger')
const {validateBody} = require('../middlewares/validation')

const Joi = require('joi')
const userSchema = Joi.object().keys({
  id: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  firstName: Joi.string().alphanum().min(3).max(30).required(),
  lastName: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().regex(/^(?=(.*[a-z])+)(?=(.*[0-9])+)[0-9a-zA-Z!\"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]{6,}$/, 'password').required()
})

const router = ({service, authenticationService}) => {
  const {isAuthenticated, isAuthorized, renewToken} = authenticationService
  const router = express.Router()
  router
    .post('/',
      validateBody(userSchema),
      (req, res, next) => {
        service.createUser(req.body).then(body => {
          res.setBody(body)
          next()
        }).catch(next)
      }
    )
    .get('/',
      isAuthenticated,
      isAuthorized((req, authUser) => authUser.hasAuthorizations('role_admin')),
      (req, res, next) => {
        service.getAllUsers().then(body => {
          res.setBody(body)
          next()
        }).catch(next)
      }
    )
    .get('/:id',
      isAuthenticated,
      isAuthorized((req, authUser) =>
          authUser.hasAuthorizations('role_admin') || req.params.id === authUser.id),
      (req, res, next) => {
        const { id } = req.params
        service.getUser(id).then(body => {
          res.setBody(body)
          next()
        }).catch(next)
    }
  )
  .use((req, res, next) => {
    if(!res.statusCode && !res.body) {
      throw new ERRORS.NOT_FOUND_ERROR()
    } else {
      next()
    }
  })
  .use(renewToken)

  return router
}

module.exports = router
