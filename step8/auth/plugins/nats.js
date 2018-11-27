'use strict'

const fp = require('fastify-plugin')
const NATS = require('nats')

module.exports = fp(async (fastify, opts, next) => {
  const nats = NATS.connect({
    url: process.env.NATS
  })

  nats.on('connect', nc => {
    fastify
      .decorate('nats', nats)
      .addHook('onClose', close)
    next()
  })

  nats.on('error', err => {
    next(err)
  })
})