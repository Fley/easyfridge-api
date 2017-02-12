class AUTHENTICATION_ERROR extends Error {
  constructor (message = 'Wrong authentication') {
    super()
    this.name = 'AUTHENTICATION_ERROR'
    this.message = message
    this.httpStatus = 401
    Error.captureStackTrace( this, this.constructor )
  }
}
class FORBIDDEN_ERROR extends Error {
  constructor (message = 'Forbidden') {
    super()
    this.name = 'FORBIDDEN_ERROR'
    this.message = message
    this.httpStatus = 403
    Error.captureStackTrace( this, this.constructor )
  }
}
class NOT_FOUND_ERROR extends Error {
  constructor (message = 'Not found') {
    super()
    this.name = 'NOT_FOUND_ERROR'
    this.message = message
    this.httpStatus = 404
    Error.captureStackTrace( this, this.constructor )
  }
}
class CONFLICT_ERROR extends Error {
  constructor (message = 'Conflict') {
    super()
    this.name = 'CONFLICT_ERROR'
    this.message = message
    this.httpStatus = 409
    Error.captureStackTrace( this, this.constructor )
  }
}
const UNKNOWN_ERROR_MESSAGE = 'Something went wrong on our end.'
class UNKNOWN_ERROR extends Error {
  constructor (message = UNKNOWN_ERROR_MESSAGE) {
    super()
    this.name = 'UNKNOWN_ERROR'
    this.message = message
    this.httpStatus = 500
    Error.captureStackTrace( this, this.constructor )
  }
}

module.exports = {
  AUTHENTICATION_ERROR,
  FORBIDDEN_ERROR,
  NOT_FOUND_ERROR,
  CONFLICT_ERROR,
  UNKNOWN_ERROR,
  UNKNOWN_ERROR_MESSAGE
}
