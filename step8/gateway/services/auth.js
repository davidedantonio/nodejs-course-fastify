'use strict'

const HttpProxy = require('fastify-http-proxy')

module.exports = async (app, opts) => {

  app.register(HttpProxy, {
    upstream: process.env.AUTH_URL
  })
}

module.exports.autoPrefix = '/'