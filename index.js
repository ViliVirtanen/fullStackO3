/* eslint-disable no-undef */

require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Phone = require('./models/phone')

app.use(express.static('build'))
app.use(cors())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.res(req, 'content-length'), JSON.stringify(req.body)
  ].join(' ')
}))

app.use(express.json())


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Phone.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get('/info', async (request, response) => {

  const a = await Phone.find({}).then(ob => {
    return  ob.length
  })
  const info = {
    amount: 'Phonebook has info for ' + a + ' people',
    date: new Date(),
  }
  const text = '<p>' + info.amount + '</p>' + '<p>' + info.date + '</p>'
  response.send(text)
})

app.get('/api/persons/:id', (request, response, next) => {
  Phone.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Phone.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body) {
    return response.status(400).json({
      error: 'content missing'
    })
  } else if (!body.name) {
    return response.status(400).json({
      error: 'name must be defined'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number must be defined'
    })
  }

  const phone = new Phone({
    name: body.name,
    number: body.number,
  })

  phone.save()
    .then(saved => {
      response.json(saved)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const phone = {
    name: body.name,
    number: body.number,
  }

  Phone.findByIdAndUpdate(
    request.params.id,
    phone,
    { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})