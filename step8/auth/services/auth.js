'use strict'

const securePassword = require('secure-password')
const usersSchema = require('../models/users-schema')

module.exports = async (app, opts) => {
  const users = app.mongo.db.collection('users')
  const pwd = securePassword()

  users.createIndex({
    username: 1
  }, { unique: true })

  app.post('/signup', {
    schema: {
      body: usersSchema,
      response:{
        '200': {
          type: 'object',
          properties: {
            token: {
              description: 'Generated token',
              summary: 'Generated token',
              type: 'string'
            }
          }
        },
        '409': {
          type: 'object',
          properties: {
            message: {
              description: 'Body should have required property',
              summary: 'Body should have required property',
              type: 'string'
            },
            error: {
              description: 'Error Type',
              summary: 'Error Type',
              type: 'string'
            },
            statusCode: {
              description: 'Error Code',
              summary: 'Error Code',
              type: 'integer'
            }
          }
        },
        '400': {
          type: 'object',
          properties: {
            message: {
              description: 'Username already registerd',
              summary: 'User already registerd',
              type: 'string'
            }
          }
        }
      }
    }
  }, async (req, reply) => {
    const { fullName, username, password, type } = req.body
    const hashedPassword = await pwd.hash(Buffer.from(password))

    try {
      const data = await users.insertOne({
        "fullName": fullName,
        "username": username,
        "password": password,
        "type": type
      })
    } catch (err) {
      // duplicate key
      if (err.code === 11000) {
        return reply.code(400).send({ message: 'username already registered' })
      }
    }

    const token = await reply.jwtSign({ username, fullName, type })
    return { token: token }
  })

  app.get('/me', {
    beforeHandler: function (req, reply) {
      return req.jwtVerify()
    }
  }, async (req, reply) => {
    return req.user
  })

  app.post('/signin', {
    schema: {
      body: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: 'The username',
            summary: 'The username'
          },
          password: {
            type: 'string',
            description: 'The password...SHHHHH',
            summary: 'The password'
          }
        },
        required: ['username', 'password']
      },
      response: {
        '200': {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Generated token',
              summary: 'Generated token'
            }
          }
        },
        '400': {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              description: 'Body should have required property',
              summary: 'Missing required property'
            }
          }
        },
        '404': {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              description: 'User not found',
              summary: 'User not found'
            }
          }
        }
      }
    }
  }, async (req, reply) => {
    const { username, password } = req.body
    const user = await users.findOne({username: username})

    if (!user) {
      reply
        .code(404)
        .send({status: 'username not found'})
      return
    }

    const res = await pwd.verify(Buffer.from(password), user.hashedPassword.buffer)
    switch (res) {
      case securePassword.INVALID_UNRECOGNIZED_HASH:
        reply
          .code(404)
          .send({status: 'This hash was not made with secure-password. Attempt legacy algorithm'})
        return
      case securePassword.INVALID:
        reply
          .code(404)
          .send({status: 'Invalid password'})
        return
      case securePassword.VALID_NEEDS_REHASH:
        req.log.info({ username }, 'password needs rehashing')
        const hashedPassword = await pwd.hash(Buffer.from(password))
        await users.update({ _id: user._id }, { hashedPassword })
        break
    }

    const token = await reply.jwtSign({ username, fullName, type })
    return { token: token }
  })
}

module.exports.prefixOverride = ''