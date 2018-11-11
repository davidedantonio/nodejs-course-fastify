'use strict'

module.exports = async (fastify, opts, next) => {
  fastify.get('/', async (request, reply) => {
    reply.send({ root: true })
  })

  next()
}
