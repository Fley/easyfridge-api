const ERRORS = require('../errors')

const getUser = repository => id => {
  return repository.findUserById(id)
}

const getUserByEmail = repository => email => {
  return repository.findUserByEmail(email)
}

const createUser = repository => newUser => {
  return getUserByEmail(repository)(newUser.email).then(user => {
    if (!user) {
      return repository.createUser(newUser)
    }
    throw new ERRORS.CONFLICT_ERROR('Given user email already exists')
  })
  .then(r => getUserByEmail(repository)(newUser.email))
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
    createUser: createUser(repository)
  }
}

module.exports = service
