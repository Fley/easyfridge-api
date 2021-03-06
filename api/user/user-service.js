const ERRORS = require('../errors')

const getUser = repository => id => {
  return repository.findUserById(id)
}

const getUserByEmail = repository => email => {
  return repository.findUserByEmail(email)
}

const getAllUsers = repository => () => {
  return repository.findAll()
}

const createUser = repository => newUser => {
  return getUserByEmail(repository)(newUser.email).then(user => {
    if (!user) {
      return repository.createUser(newUser)
    }
    throw new ERRORS.CONFLICT_ERROR('Given user email already exists')
  })
  .then(() => getUserByEmail(repository)(newUser.email))
  .then(user => {
    if(!user) {
      throw new ERRORS.UNKNOWN_ERROR()
    } else {
      return user
    }
  })
}

const service = ({repository}) => {
  return {
    getUser: getUser(repository),
    getUserByEmail: getUserByEmail(repository),
    createUser: createUser(repository),
    getAllUsers: getAllUsers(repository)
  }
}

module.exports = service
