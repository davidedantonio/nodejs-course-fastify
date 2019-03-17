'use strict'

module.exports = async function(fastify, opts) {

  const tickets = fastify.mongo.db.collection('tickets')
  const { ObjectId } = fastify.mongo

  fastify.delete('/ticket/:ticketId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          ticketId: {
            description: 'The id to delete',
            summary: 'The id to delete',
            type: 'string'
          }
        }
      },
      response: {
        '200': {
          description: 'Ticket deleted',
          summary: 'Ticket deleted',
          type: 'object',
          properties: {
            status: {
              description: 'Ok if all done',
              summary: 'Ok if all done',
              type: 'string'
            }
          }
        },
        '404': {
          description: 'Ticket not found',
          summary: 'Ticket not Found',
          type: 'object',
          properties: {
            status: {
              description: 'Status message',
              summary: 'Status message',
              type: 'string'
            }
          }
        }
      }
    }
  }, async function (request, reply) {
    const id = request.params.ticketId
    const result = await tickets.deleteOne({
      _id: new ObjectId(id)
    })

    if (!result.deletedCount){
      return reply
        .code(404)
        .send({status: 'ticket not found'})
    }

    return {status: 'ok'}

  })

  fastify.get('/ticket/:ticketId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          ticketId: {
            description: 'The id to get',
            summary: 'The id to get',
            type: 'string'
          }
        }
      },
      response: {
        '200': {
          description: 'Ticket deleted',
          summary: 'Ticket deleted',
          type: 'object',
          properties: {
            _id: {
              description: 'The ticket Id',
              summary: 'The ticket Id',
              type: 'string'
            },
            title: {
              description: 'The ticket Title',
              summary: 'The ticket Title',
              type: 'string'
            },
            body: {
              description: 'The ticket Body',
              summary: 'The ticket Body',
              type: 'string'
            }
          }
        },
        '404': {
          description: 'Ticket not found',
          summary: 'Ticket not Found',
          type: 'object',
          properties: {
            status: {
              description: 'Status message',
              summary: 'Status message',
              type: 'string'
            }
          }
        }
      }
    }
  }, async function (request, reply) {
    const id = request.params.ticketId
    const result = await tickets.findOne({
      _id: new ObjectId(id)
    })

    if (!result) {
      return reply
        .code(404)
        .send({status: 'ticket not found'})
    }

    return result
  })

  fastify.get('/tickets', {
    schema: {
      response: {
        '200': {
          description: 'Get list of all tickets',
          summary: 'Get all tickets',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: {
                description: 'The ticket Id',
                summary: 'The ticket Id',
                type: 'string'
              },
              title: {
                description: 'The ticket Title',
                summary: 'The ticket Title',
                type: 'string'
              },
              body: {
                description: 'The ticket Body',
                summary: 'The ticket Body',
                type: 'string'
              }
            }
          }
        }
      }
    }
  }, async function (request, reply) {
    const result = await tickets.find().sort({
      title: -1
    }).toArray()

    return result
  })

  fastify.post('/ticket', {
    schema: {
      body: {
        type: 'object',
        properties: {
          title: {
            description: 'The ticket Title',
            summary: 'The ticket Title',
            type: 'string'
          },
          body: {
            description: 'The ticket Body',
            summary: 'The ticket Body',
            type: 'string'
          }
        },
        required: ['title','body']
      },
      response: {
        '200': {
          description: 'Get list of all tickets',
          summary: 'Get all tickets',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: {
                description: 'The ticket Id',
                summary: 'The ticket Id',
                type: 'string'
              },
              title: {
                description: 'The ticket Title',
                summary: 'The ticket Title',
                type: 'string'
              },
              body: {
                description: 'The ticket Body',
                summary: 'The ticket Body',
                type: 'string'
              }
            }
          }
        }
      }
    }
  }, async function (request, reply) {
    const data = await tickets.insertOne(request.body)
    let obj = data.ops[0]
    return obj
  })

}



module.exports.autoPrefix = '/api'
