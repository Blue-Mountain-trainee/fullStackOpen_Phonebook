const express = require("express")
const morgan = require("morgan")

const app = express()

morgan.token("body", req => JSON.stringify(req.body))

app.use(express.json())
app.use(express.text())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms \n:body')
)

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (req, res) => {
    res.json(persons)
})

app.get("/info", (req, res) => {
    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `)
})

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find(p => p.id === req.params.id)
  if (!person) {
    return res.status(404).end()
  }
  res.json(person)
})

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post("/api/persons", (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({error: "missing content"})
  }

  if (persons.some(p => p.name === body.name)) {
    return res.status(400).json({
      error: "name must be unique"
    })
  }
  
  const person = {
    id: String(generateId()),   // 課題と違うけど面倒なので以前と同じやり方
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  // console.log(persons)
  res.json(person)
})

const generateId =  () => {
  const ids = persons.map(p => Number(p.id))
  const maxId = ids.length > 0 ? Math.max(...ids) : 0
  return maxId + 1
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log("Server is running...")
})