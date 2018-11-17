'use strict'

const fp = require('fastify-plugin')
const MongoDB = require('fastify-mongodb')

module.exports = fp(async (fastify, opts) => {
  let mongoOpts = Object.assign({}, {
    useNewUrlParser: true,
    url: process.env.MONGODB_URL
  }, opts.mongodb)

  fastify.register(MongoDB, mongoOpts)
})
