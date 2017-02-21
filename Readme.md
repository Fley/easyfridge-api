# Easyfridge API
[![Build Status](https://travis-ci.org/Fley/easyfridge-api.svg?branch=master)](https://travis-ci.org/Fley/easyfridge-api)

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

#### GET `/item/:id`
#### PATCH `/item/:id`
#### DELETE `/item/:id`
