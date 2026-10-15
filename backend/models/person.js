/*
    mongoDB atlas と接続
    mogoose model を export
*/

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
mongoose.connect(url, { family: 4 })
  .then(() => console.log('connected to mongoDB...'))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    require: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: [v => /^\d{2,3}-\d+$/.test(v), 'don\'t match RegExp'],
    require: true
  }
})

personSchema.set('toJSON', { transform: (doc, ret) => {
  ret.id = ret._id
  delete ret._id
  delete ret.__v
} })

const Person = mongoose.model('Person', personSchema)

module.exports = Person