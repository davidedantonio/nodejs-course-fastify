'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('create and get ticket', async (t) => {
  const app = build(t)
  const res1 = await app.inject({
    method: 'POST',
    url: '/api/ticket',
    body: {
      title: 'Ticket title',
      body: 'ticket body'
    }
  })

  t.equal(res1.statusCode, 200) // Created
  const body1 = JSON.parse(res1.body)

  t.ok(body1._id)
  const url = `/api/ticket/${body1._id}`
  const res2 = await app.inject({
    method: 'GET',
    url: url
  })

  t.equal(res2.statusCode, 200)

  t.deepEqual(JSON.parse(res2.body), {
    _id: body1._id,
    title: 'Ticket title',
    body: 'ticket body'
  })
})

test('create and get all', async (t) => {
  const app = build(t)
  const res1 = await app.inject({
    method: 'POST',
    url: '/api/ticket',
    body: {
      title: 'Ticket title 1',
      body: 'ticket body 1'
    }
  })

  const res2 = await app.inject({
    method: 'POST',
    url: '/api/ticket',
    body: {
      title: 'Ticket title 2',
      body: 'ticket body 2'
    }
  })

  const body1 = JSON.parse(res1.body)
  const body2 = JSON.parse(res2.body)

  const resAll = await app.inject({
    method: 'GET',
    url: '/api/tickets'
  })

  t.equal(resAll.statusCode, 200)
    t.deepEqual(JSON.parse(resAll.body), [{
      _id: body2._id,
      title: 'Ticket title 2',
      body: 'ticket body 2'
    },{
      _id: body1._id,
      title: 'Ticket title 1',
      body: 'ticket body 1'
    }]
  )
})
