const config = require('../config')
const winston = require('winston')

const commonConfig = Object.assign({
    "level": "error"
  }, (config && config.logger) || {})

winston.configure({
  transports: [
    // new (winston.transports.Console)(Object.assign(
    //   JSON.parse(JSON.stringify(commonConfig)), {
    //     json: false
    //   }
    // )),
    new (winston.transports.File)(commonConfig)
  ]
})

module.exports = winston
