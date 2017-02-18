const {USERS} = require('../../database').COLLECTIONS

const serializer = user => {
  if (Array.isArray(user)) {
    return user.map(u => serializer(u))
  } else if (user) {
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

const findAll = datasource => (filters) => {
  const collection = datasource.collection(USERS)
  const users = collection.find(filters).toArray()
  console.log(users)
  return users.then(serializer)
}

const findUserById = datasource => id => {
  const collection = datasource.collection(USERS)
  const user = collection.findOne({id})
  return user.then(serializer)
}

const findUserByEmail = datasource => email => {
  const collection = datasource.collection(USERS)
  const user = collection.findOne({email})
  return user.then(serializer)
}

const createUser = datasource => user => {
  const {id, email, firstName, lastName, password} = user
  const users = datasource.collection(USERS)
  return users.insertOne({id, email, firstName, lastName, password})
}

module.exports = ({datasource}) => {
  return {
    findAll: findAll(datasource),
    findUserById: findUserById(datasource),
    findUserByEmail: findUserByEmail(datasource),
    createUser: createUser(datasource)
  }
}
