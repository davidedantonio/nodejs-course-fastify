'use strict'

const purchaseSchema = require('../models/purchases-schema')

module.exports = async (app, opts) => {
  const purchases = app.mongo.db.collection('purchases')
  const { ObjectId } = app.mongo

  app.post('/', {
    schema: {
      tags: ['Purchases'],
      body: Object.assign({}, purchaseSchema, {
        description: 'Purchase information to save',
        summary: 'Purchase information'
      }),
      response: {
        '200': Object.assign({}, purchaseSchema, {
          description: 'Added purchase information',
          summary: 'Added purchase'
        })
      }
    }
  }, async(req, reply) => {
    req.body.orderedAt = Date.now() / 1000 | 0
    const data = await purchases.insertOne(req.body)
    let obj = data.ops[0]
    return obj
  })

  app.put('/:id/deliver', {
    schema: {
      tags: ['Purchases'],
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
    const result = await purchases.findOne({
      _id: new ObjectId(id)
    })

    if (!result) {
      return reply
        .code(404)
        .send({status: 'purchase not found'})
    }

    const data = await purchases.updateOne(
      { _id: new ObjectId(id) },
      { $set: { delivered: true } }
    )

    if (data.result.ok)
      return { "status": "ok" }
    return { "status": "ko" }
  })

  app.put('/:id', {
    schema: {
      tags: ['Purchases'],
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
          ready: {
            type: 'boolean'
          }
        },
        required: ['ready']
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
    const result = await purchases.findOne({
      _id: new ObjectId(id)
    })

    if (!result) {
      return reply
        .code(404)
        .send({status: 'purchase not found'})
    }

    let readyAt = Date.now() / 1000 | 0
    const data = await purchases.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ready: req.body.ready, readyAt: readyAt } }
    )

    if (data.result.ok)
      return { "status": "ok" }
    return { "status": "ko" }
  })
}
