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
    }
  },
  required: ['fullName', 'username', 'password']
}

module.exports = userSchema