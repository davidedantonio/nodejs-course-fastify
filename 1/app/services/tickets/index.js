'use strict'

module.exports = async function(fastify, opts) {

  const tickets = fastify.mongo.db.collection('tickets')
  const { ObjectId } = fastify.mongo

  fastify.delete('/ticket/:ticketId', async function (request, reply) {
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

  fastify.get('/ticket/:ticketId', async function (request, reply) {
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

  fastify.get('/tickets', async function (request, reply) {
    const result = await tickets.find().sort({
      title: -1
    }).toArray()

    return result
  })

  fastify.post('/ticket', async function (request, reply) {
    const data = await tickets.insertOne(request.body)
    let obj = data.ops[0]
    return obj
  })

  fastify.put('/ticket', async function (request, reply) {
    const data = await tickets.updateOne(
      { _id: new ObjectId(request.body._id) },
      { $set : {
        title: request.body.title,
        body: request.body.body,
      }})
    return { status: data.result.ok === 1 ? 'ok' : 'ko'}
  })

}

module.exports.autoPrefix = '/api'
