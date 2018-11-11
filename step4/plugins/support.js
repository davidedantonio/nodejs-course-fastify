'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async (fastify, opts, next) => {
  fastify.decorate('someSupport', function () {
    return 'hugs'
  })
  next()
})
