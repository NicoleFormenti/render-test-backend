const express = require('express')
const app = express()
//middleware to allow cross-origins requests
const cors = require('cors')

app.use(express.json()) //activating the json parser for the post request
//middlewares
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
  
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(requestLogger)
  app.use(cors())
  app.use(express.static('dist'))

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})
//generating a new id for the new note we add
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id)) //creates a new array that contains all the ids of the notes, and max return the highest number
    : 0 //however, the array needs to be transformed into individual numbers with the ... syntax, otherwise we can't understand which's the bigger number
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body //without the json parser the body parameter would be undefined

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false, //if the importance value is missing, we assign false by default
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }

})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id) //we need to turn this into a number otherwise the programm reads 1 === '1' which throws an error
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
