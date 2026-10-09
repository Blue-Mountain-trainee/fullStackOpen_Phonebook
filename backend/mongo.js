/*
 *  Mongooseの練習用環境
 *  ほかのコードとは無関係
 */

const mongoose = require("mongoose")

// ネットワーク問題のローカルな回避策．いずれ削除予定
const dns = require('node:dns')
dns.setServers(['1.1.1.1'])

const argc = process.argv.length
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

if (argc !==3 && argc !== 5) {
    console.log("usage: node mongo.js <password:necessary> [<name>, <number> :optional]")
    process.exit(1)
}

mongoose.set('strictQuery',false)

const url = `mongodb+srv://8126502_db_user:${password}@cluster0.rhy7fxe.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(url, { family: 4 })
        .then(() => console.log("connected"))
        .catch((e) => console.log(e))

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema)

if (argc === 3) {
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })

        mongoose.connection.close()
    })
} 

if (argc === 5) {
    const person = new Person({
        name,
        number
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}

