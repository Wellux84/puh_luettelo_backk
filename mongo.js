const mongoose = require('mongoose')

//if (process.argv.length < 2) {
//console.log('give password as argument')
//process.exit(1)
//}
const password = process.argv[2]


const url = `mongodb://jullesammakka:${password}@cluster0-shard-00-00.y70if.mongodb.net:27017,cluster0-shard-00-01.y70if.mongodb.net:27017,cluster0-shard-00-02.y70if.mongodb.net:27017/notesApp?ssl=true&replicaSet=atlas-qrs99q-shard-0&authSource=admin&appName=Cluster0`
mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is easy',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})