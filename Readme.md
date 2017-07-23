# Easyfridge API
[![Build Status](https://travis-ci.org/Fley/easyfridge-api.svg?branch=master)](https://travis-ci.org/Fley/easyfridge-api)
[![Coverage Status](https://coveralls.io/repos/github/Fley/easyfridge-api/badge.svg?branch=master)](https://coveralls.io/github/Fley/easyfridge-api?branch=master)


## Endpoints

### Authentication

#### POST `/authentication`

### User
```json
{
  "id": "bdenbrough",
  "email": "bdenbrough@derry.it",
  "name": "Bill Denbrough",
  "password": "silver" // Write only
}
```

#### POST `/user`
- **Authorizations**: Public

#### GET `/user`
- **Authorizations**: Admin

#### GET `/user/:id`
- **Authorizations**: Admin or User with `id`

#### PATCH `/user/:id`
- **Authorizations**: Admin or User with `id`
#### DELETE `/user/:id`
- **Authorizations**: Admin or User with `id`

### Fridge
- **Authorizations**: Admin or User
```json
{
  "id": 42,
  "name": "Derry",
  "items": [ ...items ]
}
```

#### POST `/fridge`
#### GET `/fridge`
#### GET `/fridge/:id`
#### PATCH `/fridge/:id`
#### DELETE `/fridge/:id`
#### POST `/fridge/:id/item`
#### GET `/fridge/:id/item`
#### GET `/fridge/:id/item/:id`
#### PATCH `/fridge/:id/item/:id`
#### DELETE `/fridge/:id/item/:id`

### Item
- **Authorizations**: Admin or User
```json
{
  "id": 42,
  "name": "Bird",
  "perishableDate": 1234567890,
  "quantity": 4,
  
}
```

#### GET `/item/:id`
#### PATCH `/item/:id`
#### DELETE `/item/:id`
