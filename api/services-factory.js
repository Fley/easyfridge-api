const createServicesFactory = ({datasource, config}) => {

  let userService
  const getUserService = () => {
    if (!userService) {
      const repository = require('./user/user-repository')({datasource})
      userService = require('./user/user-service')({repository})
    }
    return userService
  }

  let authenticationService
  const getAuthenticationService = () => {
    if (!authenticationService) {
      authenticationService = require('./authentication/authentication-service')({
        userService: getUserService(),
        config: config.authentication
      })
    }
    return authenticationService
  }

  return {
    getUserService,
    getAuthenticationService
  }
}

module.exports = createServicesFactory
