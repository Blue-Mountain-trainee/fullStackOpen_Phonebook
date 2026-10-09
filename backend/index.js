require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const Person = require("./models/person")

const app = express()

morgan.token("body", req => JSON.stringify(req.body))
const requestLogger =  morgan('\n:method :url :status :res[content-length] - :response-time ms \nreq body :body')

app.use(express.static("dist"))
app.use(express.json())
app.use(express.text())
app.use(requestLogger)

app.get("/api/persons", (req, res) => { // mongoosed
    Person.find({}).then(result => {
       res.json(result) 
    })
})

app.get("/info", (req, res) => {
    Person.find({})
        .then(result => {
            const line1 = `<p>Phonebook has info for ${result.length} people</p>`
            const line2 = `<p>${new Date()}</p>`
            res.send(line1 + line2)
        })

})

app.get("/api/persons/:id", (req, res, next) => { // mongoosed
  const id = req.params.id
  Person.findById(id)
    .then(person => {
      if (!person) return res.status(404).end()
      res.json(person)
    })
    .catch(e => next(e))
})

app.delete("/api/persons/:id", (req, res, next) => { // mongoosed
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(person => {
      if (!person) return res.status(404).end()
      res.status(204).end()
    })
    .catch(e => next(e))
})

app.post("/api/persons", async (req, res) => { // mongoosed
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({error: "missing content"})
  }

  if (await Person.findOne({ name: body.name })) {
    return res.status(400).json({
      error: "name must be unique"
    })
  }
  
  const person = new Person({
    name: body.name,
    number: body.number
  })
  console.log("model intance:\n", person)
  person.save().then(savedPerson => {
    console.log("save result:\n", savedPerson)
    res.json(savedPerson)
  })
})

app.put("/api/persons/:id", (req, res, next) => {
  const newPerson = req.body
  Person.findById(req.params.id)
    .then(person => {
      if (!person) return res.status(404).end()
      person.number = newPerson.number
      return person.save()
        .then(savedPerson => {
          res.json(savedPerson)
        })
    })
    .catch(e => next(e))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const errorhandler = (error, req, res, next) => {
  console.error(error.name)

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  }

  next(error)
}

app.use(errorhandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Server is running...")
})