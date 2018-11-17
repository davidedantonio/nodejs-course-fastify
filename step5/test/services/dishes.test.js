'use strict'

const { test } = require('tap')
const {
  build,
  testWithLogin
} = require('../../../step6/test/helper')

test('cannot create a dish without a login', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/dishes',
    body: {
      name: "Linguine allo scoglio",
      description: "Linguine",
      price: 10
    }
  })

  t.equal(res.statusCode, 401)
})

test('cannot get all dishes without a login', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/api/dishes'
  })

  t.equal(res.statusCode, 401)
})

testWithLogin('create and get dish', async (t, inject) => {
  const res1 = await inject({
    method: 'POST',
    url: '/api/dishes',
    body: {
      name: "Linguine allo scoglio",
      description: "Linguine",
      price: 10
    }
  })

  t.equal(res1.statusCode, 200) // Created
  const body1 = JSON.parse(res1.body)

  t.ok(body1._id)
  const url = `/api/dishes/${body1._id}`
  const res2 = await inject({
    method: 'GET',
    url: url
  })

  t.equal(res2.statusCode, 200)

  t.deepEqual(JSON.parse(res2.body), {
    _id: body1._id,
    name: "Linguine allo scoglio",
    description: "Linguine",
    price: 10
  })
})

testWithLogin('create and get all', async (t, inject) => {
  const res1 = await inject({
    method: 'POST',
    url: '/api/dishes',
    body: {
      name: "Linguine allo scoglio",
      description: "Linguine",
      price: 10
    }
  })

  const res2 = await inject({
    method: 'POST',
    url: '/api/dishes',
    body: {
      name: "Pasta e cicer",
      description: "Pasta e cicer",
      price: 5
    }
  })

  const body1 = JSON.parse(res1.body)
  const body2 = JSON.parse(res2.body)

  const resAll = await inject({
    method: 'GET',
    url: '/api/dishes'
  })

  t.equal(resAll.statusCode, 200)
    t.deepEqual(JSON.parse(resAll.body), [{
      _id: body1._id,
      name: "Linguine allo scoglio",
      description: "Linguine",
      price: 10
    },{
      _id: body2._id,
      name: "Pasta e cicer",
      description: "Pasta e cicer",
      price: 5
    }]
  )
})

testWithLogin('do not create a dishes without a name', async (t, inject) => {
  const res1 = await inject({
    method: 'POST',
    url: '/api/dishes',
    body: {
      description: "Linguine",
      price: 10
    }
  })

  t.equal(res1.statusCode, 400)
  t.equal(JSON.parse(res1.body).message, 'body should have required property \'name\'')
})

testWithLogin('do not create a dishes without a description', async (t, inject) => {
  const res1 = await inject({
    method: 'POST',
    url: '/api/dishes',
    body: {
      name: "Linguine",
      price: 10
    }
  })

  t.equal(res1.statusCode, 400)
  t.equal(JSON.parse(res1.body).message, 'body should have required property \'description\'')
})

testWithLogin('do not create a dishes without a price', async (t, inject) => {
  const res1 = await inject({
    method: 'POST',
    url: '/api/dishes',
    body: {
      name: "Linguine",
      description: "Linguine"
    }
  })

  t.equal(res1.statusCode, 400)
  t.equal(JSON.parse(res1.body).message, 'body should have required property \'price\'')
})

testWithLogin('do not create a dish with string price', async (t, inject) => {
  const res1 = await inject({
    method: 'POST',
    url: '/api/dishes',
    body: {
      name: "Pasta e cicer",
      description: "Pasta e cicer",
      price: 'lkj'
    }
  })

  t.equal(res1.statusCode, 400)
  t.equal(JSON.parse(res1.body).message, 'body.price should be number')
})