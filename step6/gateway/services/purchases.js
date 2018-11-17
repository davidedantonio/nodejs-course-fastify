'use strict'

const HttpProxy = require('fastify-http-proxy')

module.exports = async (app, opts) => {

  app.register(HttpProxy, {
    upstream: process.env.PURCHASES_SERVICE
  })
}

module.exports.autoPrefix = '/api/purchases'
