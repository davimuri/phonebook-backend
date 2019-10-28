const mongoose = require('mongoose')

if (process.argv.length < 3 || process.argv.length > 5) {
    console.log(
        `Usage:
            node mongo.js <password> -> Prints all phonebook entries
            node mongo.js <password> <name> <number> -> Inserts a phonebook entry`)

    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3] || undefined
const number = process.argv[4] || undefined

const url =
  `mongodb+srv://phonebdbusr:${password}@dbcluster1-e6gxl.mongodb.net/phoneb?retryWrites=true&w=majority`

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
    const person = new Person({ name, number })

    person.save().then(response => {
        console.log('person saved!')
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(result => {
        result.forEach(p => console.log(p))
        mongoose.connection.close()
    })
}
