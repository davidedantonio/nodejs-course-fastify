'use strict'

const tablesSchema = require('../models/tables-schema')

module.exports = async (app, opts) => {
  const tables = app.mongo.db.collection('tables')
  const { ObjectId } = app.mongo

  app.get('/', {
    schema: {
      response: {
        '2xx': {
          type: 'array',
          items: tablesSchema
        }
      }
    }
  }, async(req, reply) => {
    const result = await tables.find().sort({
      name: 1
    }).toArray()

    return result
  })

  app.post('/', {
    schema: {
      body: tablesSchema,
      response: {
        '200': tablesSchema,
      }
    }
  }, async(req, reply) => {
    const data = await tables.insertOne(req.body)
    let obj = data.ops[0]
    return obj
  })

  app.get('/:id', {
    schema: {
      response: {
        '2xx': tablesSchema
      }
    }
  }, async(req, reply) => {
    const id = req.params.id
    const result = await tables.findOne({
      _id: new ObjectId(id)
    })

    if (!result) {
      return reply
        .code(404)
        .send({status: 'table not found'})
    }

    return result
  })

  app.delete('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        '200': {
          type: 'object',
          properties: {
            status: { type: 'string' }
          }
        }
      }
    }
  }, async(req, reply) => {
    const id = req.params.id
    const result = await tables.deleteOne({
      _id: new ObjectId(id)
    })

    if (!result.deletedCount){
      return reply
        .code(404)
        .send({status: 'table not found'})
    }

    return {status: 'ok'}
  })
}

module.exports.autoPrefix = '/tables'