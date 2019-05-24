'use strict'

const fp = require('fastify-plugin')
const JWT = require('fastify-jwt')

module.exports = fp(async (fastify, opts, next) => {
  fastify.register(JWT, {
    secret: process.env.JWT_SECRET
  })

  fastify.addHook('preHandler', async (req, reply) => {
    if (req.raw.url.startsWith('/api')) {
      return req.jwtVerify()
    }
  })
})