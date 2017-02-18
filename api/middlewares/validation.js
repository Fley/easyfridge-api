const ERRORS = require('../errors')
const Joi = require('joi')

const validateBody = (schema) => (req, res, next) => validate(req.body, schema, next)

const validate = (object, schema, next) => Joi.validate(object, schema, (err, value) => {
  if (err) {
    throw new ERRORS.BAD_REQUEST_ERROR(err.details.reduce(
      (msg, detail, i) => (i > 0 ? ',' : '') + msg + detail.message, '')
    )
  }
  next && next()
})

module.exports = {
  validateBody,
  validate
}
