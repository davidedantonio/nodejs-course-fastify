'use strict'

const HttpProxy = require('fastify-http-proxy')

module.exports = async (app, opts) => {

  app.register(HttpProxy, {
    upstream: process.env.TABLES_SERVICE
  })
}

module.exports.autoPrefix = '/api/tables'
