const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json())
app.use((req, res, next) => {
  const oldJson = res.json;

  res.json = function (body) {
    res.locals.body = body;   // ← talletetaan body Morgania varten
    return oldJson.call(this, body);
  };

  next();
});

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    JSON.stringify(res.locals.body),   // ← tässä se JSON
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}));


let persons = [
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": "1"
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": "2"
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": "3"
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": "4"
    }
  ]

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)

    person ? res.json(person) : res.status(404).send('<h2>No found</h2>').end()
})

app.get('/api/persons/', (req, res) => {
    let time = new Date().toLocaleString()
    console.log (time)
    return res.json(persons)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()

})

app.post('/api/persons', (req, res) => {
  const person = req.body
  if (!person) {
    return res.status(400).json({error: 'You must send person name and number'})
  }
  if (!person.name ) {
    return res.status(400).json({error: 'name is missing'})
  }
  if (!person.number ) {
    return res.status(400).json({error: 'number is missing'})
  }
  if (persons.find(p => p.name === person.name)) {
    return res.status(400).json({error: 'name must be unique'})
  }
  person.id = Math.floor(Math.random() * 1000000)
  persons = persons.concat(person)
  res.json(person)
})

app.get('/info', (req, res) => {
    let info = persons.length
    let date = new Date().toLocaleString()
    res.send(`<h1>Phonebook has info for ${info} people</h1><h3>${date}</h3>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Serveri on ranning on port ${PORT}`)
})