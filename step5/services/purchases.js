'use strict'

const purchaseSchema = require('../models/purchases-schema')

module.exports = async (app, opts) => {
  const purchases = app.mongo.db.collection('purchases')
  const { ObjectId } = app.mongo

  app.post('/', {
    schema: {
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
    const data = await purchases.insertOne(req.body)
    let obj = data.ops[0]
    return obj
  })
}

module.exports.autoPrefix = '/purchases'