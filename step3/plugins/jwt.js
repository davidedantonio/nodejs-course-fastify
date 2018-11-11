'use strict'

const fp = require('fastify-plugin')
const JWT = require('fastify-jwt')

module.exports = fp(async (fastify, opts) => {
  let jwtOpts = Object.assign({}, {
    secret: process.env.JWT_SECRET
  }, opts.jwt)

  fastify.register(JWT, jwtOpts)
})