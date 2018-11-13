'use strict'

const fp = require('fastify-plugin')
const swagger = require('fastify-swagger')

module.exports = fp(async (fastify, opts) => {
  const swaggerOptions = Object.assign ({}, {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Tables API',
        description: 'Tables api definition',
        version: process.env.npm_package_version
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      },
      tags: [
        { name: 'Purchases', description: 'Purchases' },
        { name: 'Tables', description: 'Manage restaurant\'s tables' },
        { name: 'Dishes', description: 'Manage restaurant\'s dish' }
      ],
      host: `localhost:${process.env.PORT}`,
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json']
    },
    exposeRoute: true
  }, opts.swagger)

  fastify.register(swagger, swaggerOptions)
})