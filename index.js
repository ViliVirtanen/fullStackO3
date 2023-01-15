const { response } = require('express')
const express = require('express')
const app = express()
var morgan = require('morgan')

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
let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/info', (request, response) => {
    const info = {
        amount: "Phonebook has info for " + phonebook.length + " people",
        date: new Date(),
    }
    const text = "<p>" + info.amount + "</p>" + "<p>" + info.date + "</p>"
    response.send(text)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = phonebook.find(note => note.id === id)
    
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
    const id = Math.ceil(Math.random() * 100000)
    const body = request.body
    const data = {
        id: id,
        name: "",
        number: "",
    }
    
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
    } else if (phonebook.filter(a => a.name === body.name).length > 0) {
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }
    data.name = body.name
    data.number = body.number
    phonebook = phonebook.concat(data)
    response.json(data)
    
  })


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})