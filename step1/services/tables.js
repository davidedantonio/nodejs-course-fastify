'use strict'

module.exports = async (app, opts) => {
  const tables = app.mongo.db.collection('tables')
  const { ObjectId } = app.mongo

  app.get('/', async(req, reply) => {
    const result = await tables.find().sort({
      name: -1
    }).toArray()

    return { tables: result }
  })

  app.post('/', async(req, reply) => {
    const data = await tables.insertOne(req.body)
    let obj = data.ops[0]
    return {table: obj}
  })

  app.get('/:id', async(req, reply) => {
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

  app.delete('/:id', async(req, reply) => {
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