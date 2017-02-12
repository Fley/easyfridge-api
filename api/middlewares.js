const uuidV4 = require('uuid/v4');
const logger = require('../logger')
const ERRORS = require('./errors')

const logRequest = (req, res, next) => {
  req.id = uuidV4()
  logger.info('>>> Request', {
    id: req.id,
    method: req.method,
    path: req.path,
    query: req.query,
    headers: req.headers
  })
  logger.verbose('>>> Request Body', {
    id: req.id,
    body: req.body
  })
  next()
}

const handleErrors = (err, req, res, next) => {
  sendError(err, res)
  next()
}

const sendError = (err, res) => {
  logger.error(err)
  const message = (err && err.message) || ERRORS.UNKNOWN_ERROR_MESSAGE
  const status = (err && err.httpStatus) || 500
  res.status(status).setBody({ error: message })
}

const sendJson = (req, res, next) => {
  if(!res.statusCode) {
    if(res.body) {
      res.status(req.method==='POST' ? 201 : 200)
    } else {
      // TODO: REMOVE THIS LINE and check it in a separate middleware BEFORE setting authtoken !!
      sendError(new ERRORS.UNKNOWN_ERROR(), res)
    }
  }
  res.json(res.body)
  next()
}

const logResponse = (req, res, next) => {
  logger.info('<<< Response', {
    id: req.id,
    status: res.statusCode,
    headers: res._headers
  })
  const replacer = res.app.get('json replacer')
  const spaces = res.app.get('json spaces')
  logger.verbose('<<< Response Body', {
    id: req.id,
    body: JSON.parse(JSON.stringify(res.body, replacer, spaces))
  })
}

module.exports = {
  logRequest,
  sendJson,
  handleErrors,
  logResponse
}
