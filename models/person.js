const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = 'mongodb://jullesammakka:wellu312@cluster0-shard-00-00.y70if.mongodb.net:27017,cluster0-shard-00-01.y70if.mongodb.net:27017,cluster0-shard-00-02.y70if.mongodb.net:27017/Phonebook?ssl=true&replicaSet=atlas-qrs99q-shard-0&authSource=admin&appName=Cluster0'

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{5,}$/.test(v)    }
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)