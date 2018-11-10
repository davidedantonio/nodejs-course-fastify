'use strict'

const { test } = require('tap')
const {
  build,
} = require('../helper')

test('create and get table', async (t) => {
  const app = build(t)
  const res1 = await app.inject({
    method: 'POST',
    url: '/tables',
    body: {
      name: "Table 1",
      seats: 5
    }
  })

  t.equal(res1.statusCode, 200) // Created
  const body1 = JSON.parse(res1.body)

  t.ok(body1._id)
  const url = `/tables/${body1._id}`
  const res2 = await app.inject({
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

test('create and get all', async (t) => {
  const app = build(t)
  const res1 = await app.inject({
    method: 'POST',
    url: '/tables',
    body: {
      name: "Table 1",
      seats: 5
    }
  })

  const res2 = await app.inject({
    method: 'POST',
    url: '/tables',
    body: {
      name: "Table 2",
      seats: 10
    }
  })

  const body1 = JSON.parse(res1.body)
  const body2 = JSON.parse(res2.body)

  const resAll = await app.inject({
    method: 'GET',
    url: '/tables'
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

test('do not create a table without a name', async (t) => {
  const app = build(t)
  const res1 = await app.inject({
    method: 'POST',
    url: '/tables',
    body: {
      seats: 5
    }
  })

  t.equal(res1.statusCode, 400)
  t.equal(JSON.parse(res1.body).message, 'body should have required property \'name\'')
})


test('do not create a table without a seats', async (t) => {
  const app = build(t)
  const res1 = await app.inject({
    method: 'POST',
    url: '/tables',
    body: {
      name: 'Table 1'
    }
  })

  t.equal(res1.statusCode, 400)
  t.equal(JSON.parse(res1.body).message, 'body should have required property \'seats\'')
})

test('do not create a table with string seats', async (t) => {
  const app = build(t)
  const res1 = await app.inject({
    method: 'POST',
    url: '/tables',
    body: {
      name: 'Table 1',
      seats: 'ping'
    }
  })

  t.equal(res1.statusCode, 400)
  t.equal(JSON.parse(res1.body).message, 'body.seats should be integer')
})