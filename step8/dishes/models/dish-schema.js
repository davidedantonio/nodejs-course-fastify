const dishSchema = {
  type: 'object',
  properties: {
    _id: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    price: {
      type: 'number'
    }
  },
  required: ['name', 'description', 'price']
}

module.exports = dishSchema