'use strict'

const dishSchema = require('../models/dish-schema')

module.exports = async (app, opts) => {
  const dishes = app.mongo.db.collection('dishes')
  const { ObjectId } = app.mongo

  app.get('/', {
    schema: {
      tags: ['Dishes'],
      response: {
        '200': {
          description: 'Get list of all dishes',
          summary: 'Get all dishes',
          type: 'array',
          items: dishSchema
        }
      }
    }
  }, async(req, reply) => {
    const result = await dishes.find().sort({
      name: 1
    }).toArray()

    return result
  })

  app.post('/', {
    schema: {
      tags: ['Dishes'],
      body: Object.assign({}, dishSchema, {
        description: 'Dish information to save',
        summary: 'Dish information'
      }),
      response: {
        '200': Object.assign({}, dishSchema, {
          description: 'Added dish information',
          summary: 'Added dish'
        })
      }
    }
  }, async(req, reply) => {
    const data = await dishes.insertOne(req.body)
    let obj = data.ops[0]
    return obj
  })

  app.get('/:id', {
    schema: {
      tags: ['Dishes'],
      response: {
        '200': Object.assign({}, dishSchema, {
          description: 'Dish information',
          summary: 'Dish information'
        })
      }
    }
  }, async(req, reply) => {
    const id = req.params.id
    const result = await dishes.findOne({
      _id: new ObjectId(id)
    })

    if (!result) {
      return reply
        .code(404)
        .send({status: 'dish not found'})
    }

    return result
  })

  app.delete('/:id', {
    schema: {
      tags: ['Dishes'],
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
    const result = await dishes.deleteOne({
      _id: new ObjectId(id)
    })

    if (!result.deletedCount){
      return reply
        .code(404)
        .send({status: 'dish not found'})
    }

    return {status: 'ok'}
  })
}
