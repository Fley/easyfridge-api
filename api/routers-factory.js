const getUserRouter = servicesFactory => () => {
  const authenticationService = servicesFactory.getAuthenticationService()
  const service = servicesFactory.getUserService()
  return require('./user/user-router')({service, authenticationService})
}

const getAuthenticationRouter = servicesFactory => () => {
  const service = servicesFactory.getAuthenticationService()
  return require('./authentication/authentication-router')({service})
}

const createRoutersFactory = servicesFactory => {
  return {
    getUserRouter: getUserRouter(servicesFactory),
    getAuthenticationRouter: getAuthenticationRouter(servicesFactory)
  }
}

module.exports = createRoutersFactory
