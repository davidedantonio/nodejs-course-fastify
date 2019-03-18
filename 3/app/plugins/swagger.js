'use strict'

const fp = require('fastify-plugin')
const swagger = require('fastify-swagger')

module.exports = fp(async (fastify, opts) => {
  const swaggerOptions = Object.assign ({}, {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Tickets API',
        description: 'Tickets api definition',
        version: process.env.npm_package_version
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      },
      host: `localhost:${process.env.PORT || 3000}`,
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json']
    },
    exposeRoute: true
  }, opts.swagger)

  fastify.register(swagger, swaggerOptions)
})
