'use strict'

const tablesSchema = require('../models/tables-schema')

module.exports = async (app, opts) => {
  const tables = app.mongo.db.collection('tables')
  const { ObjectId } = app.mongo

  app.get('/', {
    schema: {
      tags: ['Tables'],
      response: {
        '200': {
          description: 'Get list of all tables',
          summary: 'Get all tables',
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
      tags: ['Tables'],
      body: Object.assign({}, tablesSchema, {
        description: 'Table information to save',
        summary: 'Table information'
      }),
      response: {
        '200': Object.assign({}, tablesSchema, {
          description: 'Added table information',
          summary: 'Added table'
        })
      }
    }
  }, async(req, reply) => {
    const data = await tables.insertOne(req.body)
    let obj = data.ops[0]
    return obj
  })

  app.put('/:id', {
    schema: {
      tags: ['Tables'],
      params: {
        type: 'object',
        properties: {
          id: {
            description: 'The id to update',
            summary: 'The id to update',
            type: 'string'
          }
        }
      },
      body: {
        type: 'object',
        properties: {
          busy: {
            type: 'boolean'
          },
          covered: {
            type: 'integer'
          }
        },
        required: ['busy', 'covered']
      },
      response: {
        '200': {
          type: 'object',
          properties: {
            status: {
              description: 'Ok if all done',
              summary: 'Ok if all done',
              type: 'string'
            }
          }
        }
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

    const data = await tables.updateOne(
      { _id: new ObjectId(id) },
      { $set: {
          busy: req.body.busy,
          covered: req.body.covered
        }
      }
    )

    if (data.result.ok)
      return { "status": "ok" }
    return { "status": "ko" }
  })

  app.get('/:id', {
    schema: {
      tags: ['Tables'],
      response: {
        '200': Object.assign({}, tablesSchema, {
          description: 'Table information',
          summary: 'Table information'
        })
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
      tags: ['Tables'],
      params: {
        type: 'object',
        properties: {
          id: {
            description: 'The id to delete',
            summary: 'The id to delete',
            type: 'string'
          }
        }
      },
      response: {
        '200': {
          type: 'object',
          properties: {
            status: {
              description: 'Ok if all done',
              summary: 'Ok if all done',
              type: 'string'
            }
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
