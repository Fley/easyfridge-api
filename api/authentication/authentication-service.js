const logger = require('../../logger')
const ERRORS = require('../errors')
const jwt = require('jsonwebtoken')

const createToken = ({userService, config}) => ({email, password}) => {
  return userService.getUserByEmail(email).then(user => {
    if (user && user.email === email && user.password === password) {
      const token = createTokenFromUser(config)(user)
      return {token}
    }
    throw new ERRORS.AUTHENTICATION_ERROR()
  })
}

const createTokenFromUser = config => user => jwt.sign({
    email: user.email
  }, config.privateKey, {
    algorithm: config.algorithm,
    expiresIn: config.validDuration,
    issuer: config.issuer
  })

const isAuthenticated = ({userService, config}) => (req, res, next) => {
  const token = req.get('x-auth-token')
  const decodedToken = verifyToken(config)(token)
  req.authenticationData = { payload: decodedToken }
  if (decodedToken) {
    logger.verbose('Authentication is verified on', req.originalUrl, 'for', decodedToken)
    return userService.getUserByEmail(decodedToken.email).then(user => {
      if (user) {
        logger.verbose('Found actual user for', decodedToken)
        user.hasAuthorizations = authorizations => {
          const required = Array.isArray(authorizations) ? authorizations : [authorizations]
          return user.authorizations && required.every(authorization => user.authorizations.includes(authorization))
        }
        req.authenticationData.authenticatedUser = user
      } else {
        logger.error('Token user', decodedToken.email, 'does not exist.')
        throw new ERRORS.AUTHENTICATION_ERROR()
      }
      next()
    }).catch(next)
  } else {
    throw new ERRORS.AUTHENTICATION_ERROR()
  }
}

const verifyToken = config => token => {
  try {
    return jwt.verify(token, config.privateKey, {
      algorithm: config.algorithm,
      issuer: config.issuer
    })
  } catch(err) {
    logger.warn('Invalid token"' + token + '".')
    logger.debug(err)
    return null
  }
}

const isAuthorized = (checkAuthorizations) => (req, res, next) => {
  const authUser = getAuthenticatedUser(req)
  if (typeof checkAuthorizations !== 'function' || authUser && checkAuthorizations(req, authUser)) {
    next()
  } else {
    throw new ERRORS.FORBIDDEN_ERROR()
  }
}

const renewToken = config => (req, res, next) => {
  const user = getAuthenticatedUser(req)
  logger.verbose('Renewing token for current user', user)
  if (user) {
    const token = createTokenFromUser(config)(user)
    logger.verbose('New token is', token)
    res.set('x-auth-token', token)
  }
  next()
}

const getAuthenticatedUser = req =>
  req && req.authenticationData ? req.authenticationData.authenticatedUser : null

const service = ({userService, config}) => {
  return {
    createToken: createToken({userService, config}),
    isAuthenticated: isAuthenticated({userService, config}),
    isAuthorized,
    renewToken: renewToken(config),
    getAuthenticatedUser
  }
}

module.exports = service
