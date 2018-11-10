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
      name: 'A table'
    }
  })

  t.equal(res1.statusCode, 200) // Created
  const body1 = JSON.parse(res1.body)

  t.ok(body1.table._id)
  const url = `/tables/${body1.table._id}`
  const res2 = await app.inject({
    method: 'GET',
    url: url
  })

  t.equal(res2.statusCode, 200)

  t.deepEqual(JSON.parse(res2.body), {
    _id: body1.table._id,
    name: 'A table'
  })
})

test('create and get all', async (t) => {
  const app = build(t)
  const res1 = await app.inject({
    method: 'POST',
    url: '/tables',
    body: {
      name: 'A table'
    }
  })

  const res2 = await app.inject({
    method: 'POST',
    url: '/tables',
    body: {
      name: 'A beautiful table'
    }
  })

  const body1 = JSON.parse(res1.body)
  const body2 = JSON.parse(res2.body)

  const resAll = await app.inject({
    method: 'GET',
    url: '/tables'
  })

  t.equal(resAll.statusCode, 200)

    t.deepEqual(JSON.parse(resAll.body), {
    tables: [{
      _id: body1.table._id,
      name: 'A table'
    },{
      _id: body2.table._id,
      name: 'A beautiful table'
    }]
  })
})
