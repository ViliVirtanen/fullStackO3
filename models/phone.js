const mongoose = require('mongoose')
// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phoneSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        if (v.toString().includes('-')) {
          var split = v.toString().split('-')
          return split.length === 2 && (split[0].length === 3 || split[0].length === 2) && !isNaN(split[0]) && !isNaN(split[1])
        } else {
          return !isNaN(v.toString())
        }
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  }
})

phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Contact', phoneSchema)