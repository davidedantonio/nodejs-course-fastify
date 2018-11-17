const purchasesSchema = {
  type: 'object',
  properties: {
    _id: {
      type: 'string'
    },
    table: {
      type: 'object',
      properties: {
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
      }
    },
    dishes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          price: {
            type: 'number'
          }
        }
      }
    },
    orderedAt: {
      type: 'integer'
    },
    readyAt: {
      type: 'integer'
    },
    ready: {
      type: 'boolean',
      default: false
    }
  },
  required: ['table', 'dishes']
}

module.exports = purchasesSchema