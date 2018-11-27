const userSchema = {
  type: 'object',
  properties: {
    _id: {
      type: 'string'
    },
    fullName: {
      type: 'string'
    },
    username: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    type: {
      type: 'string',
      enum: ['waiter','cook']
    }
  },
  required: ['fullName', 'username', 'password', 'type']
}

module.exports = userSchema