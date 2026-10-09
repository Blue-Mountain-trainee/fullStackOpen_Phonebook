/*
    mongoDB atlas と接続
    mogoose model を export
*/

const mongoose = require("mongoose")

// ネットワーク問題のローカルな回避策．いずれ削除予定
const dns = require('node:dns')
dns.setServers(['1.1.1.1'])

mongoose.set("strictQuery", false)

const url = process.env.MONGODB_URI
mongoose.connect(url, { family: 4 })
        .then(() => console.log("connected to mongoDB..."))

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
    }
})

const Person = mongoose.model("Person", personSchema)

module.exports = Person