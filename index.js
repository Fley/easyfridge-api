global.rootRequire = (name) => require(__dirname + '/' + name)

const logger = require('./logger')
const { createDatasource } = require('./database')
const { createApi, startApi } = require('./api')

createDatasource().then((datasource) => {
  const app = createApi({datasource})
  startApi(app)
}).catch((err) => {
  logger.error('Error creating data source !', err)
})
