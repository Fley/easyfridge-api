const config = require('../config')
const logger = require('../logger')
const { MongoClient, Logger } = require('mongodb')

const connectionUrl = config.database.url

const COLLECTIONS = {
  USERS: 'users'
}

const createDatasource = () => MongoClient.connect(connectionUrl).then(newDb => {
  logger.info('Succefully connected to database', connectionUrl)
  Logger.setLevel(config.database.logger.level)
  db = newDb
  return db
}).catch(err => {
  logger.error('Error MongoClient.connect', err);
})

module.exports = {
  createDatasource,
  COLLECTIONS
}
