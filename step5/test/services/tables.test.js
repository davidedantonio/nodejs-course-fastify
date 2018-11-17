'use strict'

const { test } = require('tap')
const {
  build,
  testWithLogin
} = require('../../../step6/test/helper')

test('cannot create a table without a login', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/tables',
    body: {
      name: "Table 1",
      seats: 5
    }
  })

  t.equal(res.statusCode, 401)
})

test('cannot get all tables without a login', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/api/tables'
  })

  t.equal(res.statusCode, 401)
})

testWithLogin('create and get table', async (t, inject) => {
  const res1 = await inject({
    method: 'POST',
    url: '/api/tables',
    body: {
      name: "Table 1",
      seats: 5
    }
  })

  t.equal(res1.statusCode, 200) // Created
  const body1 = JSON.parse(res1.body)

  t.ok(body1._id)
  const url = `/api/tables/${body1._id}`
  const res2 = await inject({
    method: 'GET',
    url: url
  })

  t.equal(res2.statusCode, 200)

  t.deepEqual(JSON.parse(res2.body), {
    _id: body1._id,
    name: "Table 1",
    seats: 5,
    busy: false,
    covered: 0
  })
})

testWithLogin('create and get all', async (t, inject) => {
  const res1 = await inject({
    method: 'POST',
    url: '/api/tables',
    body: {
      name: "Table 1",
      seats: 5
    }
  })

  const res2 = await inject({
    method: 'POST',
    url: '/api/tables',
    body: {
      name: "Table 2",
      seats: 10
    }
  })

  const body1 = JSON.parse(res1.body)
  const body2 = JSON.parse(res2.body)

  const resAll = await inject({
    method: 'GET',
    url: '/api/tables'
  })

  t.equal(resAll.statusCode, 200)
    t.deepEqual(JSON.parse(resAll.body), [{
      _id: body1._id,
      name: "Table 1",
      seats: 5,
      busy: false,
      covered: 0
    },{
      _id: body2._id,
      name: 'Table 2',
      seats: 10,
      busy: false,
      covered: 0
    }]
  )
})

testWithLogin('do not create a table without a name', async (t, inject) => {
  const res1 = await inject({
    method: 'POST',
    url: '/api/tables',
    body: {
      seats: 5
    }
  })

  t.equal(res1.statusCode, 400)
  t.equal(JSON.parse(res1.body).message, 'body should have required property \'name\'')
})

testWithLogin('do not create a table without a seats', async (t, inject) => {
  const res1 = await inject({
    method: 'POST',
    url: '/api/tables',
    body: {
      name: 'Table 1'
    }
  })

  t.equal(res1.statusCode, 400)
  t.equal(JSON.parse(res1.body).message, 'body should have required property \'seats\'')
})

testWithLogin('do not create a table with string seats', async (t, inject) => {
  const res1 = await inject({
    method: 'POST',
    url: '/api/tables',
    body: {
      name: 'Table 1',
      seats: 'ping'
    }
  })

  t.equal(res1.statusCode, 400)
  t.equal(JSON.parse(res1.body).message, 'body.seats should be integer')
})