const config = require('../config')
const logger = require('../logger')
const express = require('express')
const bodyParser = require('body-parser')
const { logRequest, sendJson, handleErrors, logResponse } = require('./middlewares');

const createServicesFactory = require('./services-factory')
const createRoutersFactory = require('./routers-factory')

const createApi = ({datasource}) => {
  const app = express()

  const routersFactory = createRoutersFactory(createServicesFactory({datasource, config}))

  app.set('json replacer', (key, value) =>
    key && ['_id'].includes(key) ? undefined : value
  )

  app.use(bodyParser.json())
  app.use(logRequest)
  app.use((req, res, next) => {
    res.setBody = body => res.body = body
    res.statusCode = undefined
    next()
  })

  app.get('/', (req, res) => {
    res.status(200).json({
      api: 'easyfridge-api'
    })
  })

  app.use('/user', routersFactory.getUserRouter())
  app.use('/authentication', routersFactory.getAuthenticationRouter())

  app.use(handleErrors)
  app.use(sendJson)
  app.use(logResponse)

  return app
}

const startApi = (app) => {
  const server = app.listen(config.port || 3000, () => {
    logger.info('Easyfridge api listening on port ' + (config.port || 3000) + '!')
  })
  server.on('close', () => {
    logger.info('Easyfridge api stopped ...')
  })
  return server
}

module.exports = {
  createApi,
  startApi
}
