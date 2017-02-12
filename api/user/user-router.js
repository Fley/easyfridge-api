const express = require('express')
const ERRORS = require('../errors')
const logger = require('../../logger')

const router = ({service, authenticationService}) => {
  const {isAuthenticated, isAuthorized, renewToken} = authenticationService
  const router = express.Router()
  router
    .post('/',
      (req, res, next) => {
        service.createUser(req.body).then(body => {
          res.setBody(body)
          next()
        }).catch(next)
      }
    )
    .get(
      '/:id',
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
