const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/info', (request, response) => {
    Person.countDocuments({}).then(count => {
        console.log(`Number of people: ${count}`)
        response.send(`Phonebook has info for ${count} people <br> ${new Date()}`)
    })
})

personsRouter.get('/', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons.map(p => p.toJSON()))
    })
})

personsRouter.get('/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id)
        .then(p => {
            if (p) {
                response.json(p.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

personsRouter.post('/', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person
        .save()
        .then(savedPerson => savedPerson.toJSON())
        .then(savedAndFormattedPerson => response.json(savedAndFormattedPerson))
        .catch(error => next(error))

})

personsRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

personsRouter.delete('/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndRemove(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

module.exports = personsRouter