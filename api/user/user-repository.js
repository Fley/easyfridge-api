const {USERS} = require('../../database').COLLECTIONS

const serializer = user => {
  if (user) {
    user.toJSON = function() {
      return {
        id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        authorizations: this.authorizations || []
      }
    }
  }
  return user
}

const findUserById = datasource => id => {
  const users = datasource.collection(USERS)
  const user = users.findOne({id})
  return user.then(serializer)
}

const findUserByEmail = datasource => email => {
  const users = datasource.collection(USERS)
  const user = users.findOne({email})
  return user.then(serializer)
}

const createUser = datasource => user => {
  const {id, email, firstName, lastName, password} = user
  const users = datasource.collection(USERS)
  return users.insertOne({id, email, firstName, lastName, password})
}

module.exports = ({datasource}) => {
  return {
    findUserById: findUserById(datasource),
    findUserByEmail: findUserByEmail(datasource),
    createUser: createUser(datasource)
  }
}
