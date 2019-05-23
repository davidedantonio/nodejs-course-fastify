const fp = require('fastify-plugin')

module.exports = fp(async (fastify, opts, next) => {
  fastify.addHook('preHandler', async (req, reply) => {
    if (req.raw.url.startsWith('/api')) {
      return req.jwtVerify()
    }
  })
  next()
})