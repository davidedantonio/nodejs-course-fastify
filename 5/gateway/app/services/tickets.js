'use strict'

const HttpProxy = require('fastify-http-proxy')

module.exports = async (app, opts) => {

  app.register(HttpProxy, {
    upstream: process.env.TICKETS_SERVICE
  })
}

module.exports.autoPrefix = '/api/tickets'