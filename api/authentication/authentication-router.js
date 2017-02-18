const express = require('express')
const {validateBody} = require('../middlewares/validation')

const Joi = require('joi')
const authSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().regex(/^(?=(.*[a-z])+)(?=(.*[0-9])+)[0-9a-zA-Z!\"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]{6,}$/, 'password').required()
})

const router = ({service}) => {
  const router = express.Router()

  router.post('/',
    validateBody(authSchema),
    (req, res, next) => {
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
