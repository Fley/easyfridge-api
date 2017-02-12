const express = require('express')

const router = ({service}) => {
  const router = express.Router()

  router.post('/', (req, res, next) => {
    const login = req.body
    service.createToken(login).then(body => {
      res.setBody(body)
      res.set('x-auth-token', body.token)
      next()
    }).catch(next)
  })
  .use(service.renewToken)

  return router
}

module.exports = router
