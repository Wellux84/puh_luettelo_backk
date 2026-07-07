require('dotenv').config()
const express = require('express');
const Person = require('./models/person')

const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json())
app.use(express.static('dist'))
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


/*let persons = [
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
    */

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
  })

app.get('/api/persons/', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()

    })
    .catch(error => { next(error) })
})

app.post('/api/persons', (req, res, next) => {
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
  //if (persons.find(p => p.name === person.name)) {
    //return res.status(400).json({error: 'name must be unique'})
 // }
  //person.id = Math.floor(Math.random() * 1000000)
  const newPerson = new Person(person)
  newPerson.save().then(savedPerson => {
    res.json(savedPerson)
    //persons = persons.concat(person)
  }).catch(error => { next(error) })
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  Person.findById(req.params.id)
    .then(perso => {
      if (!perso) {
        return res.status(404).end()
      }

      // päivitä kentät
      perso.name = body.name
      perso.number = body.number

      return perso.save()
        .then(updatedPerson => {
          res.json(updatedPerson)
        })
    })
    .catch(error => next(error))
})


app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
      let info = persons.length
      let date = new Date().toLocaleString()
      res.send(`<h1>Phonebook has info for ${info} people</h1><h3>${date}</h3>`)
    }).catch(error => next(error))

})



/*const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}*/

//app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Serveri on ranning on port ${PORT}`)
})

