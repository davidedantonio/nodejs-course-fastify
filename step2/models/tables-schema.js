const tableSchema = {
  type: 'object',
  properties: {
    _id: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    seats: {
      type: 'integer'
    },
    busy: {
      type: 'boolean',
      default: false
    },
    covered: {
      type: 'integer',
      default: 0
    }
  },
  required: ['name', 'seats', 'busy']
}

module.exports = tableSchema;