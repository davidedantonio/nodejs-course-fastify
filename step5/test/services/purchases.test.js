'use strict'

const { test } = require('tap')
const {
  build,
  testWithLogin
} = require('../../../step6/test/helper')

test('cannot create a purchase without a login', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/purchases',
    body: {
      "table": {
        "name": "Tavolo1",
        "seats": 4,
        "busy": true,
        "covered": 4
      },
      "dishes": [{
        "name": "Spaghetti allo scoglio",
        "description": "Spaghetti allo scoglio",
        "price": 8.2
      }, {
        "name": "Tagliatelle funghi porcini",
        "description": "Tagliatelle funghi porcini",
        "price": 10.3
      }]
    }
  })

  t.equal(res.statusCode, 401)
})

test('cannot get all purchases without a login', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/api/purchases'
  })

  t.equal(res.statusCode, 401)
})

testWithLogin('do not create a purchase without a table', async (t, inject) => {
  const res1 = await inject({
    method: 'POST',
    url: '/api/purchases',
    body: {
      "dishes": [{
        "name": "Spaghetti allo scoglio",
        "description": "Spaghetti allo scoglio",
        "price": 8.2
      }, {
        "name": "Tagliatelle funghi porcini",
        "description": "Tagliatelle funghi porcini",
        "price": 10.3
      }]
    }
  })

  t.equal(res1.statusCode, 400)
  t.equal(JSON.parse(res1.body).message, 'body should have required property \'table\'')
})

testWithLogin('do not create a purchase without dishes', async (t, inject) => {
  const res1 = await inject({
    method: 'POST',
    url: '/api/purchases',
    body: {
      "table": {
        "name": "Tavolo1",
        "seats": 4,
        "busy": true,
        "covered": 4
      }
    }
  })

  t.equal(res1.statusCode, 400)
  t.equal(JSON.parse(res1.body).message, 'body should have required property \'dishes\'')
})