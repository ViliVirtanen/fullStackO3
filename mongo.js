const mongoose = require('mongoose')


if (process.argv.length < 5 && process.argv.length !== 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.rg80scb.mongodb.net/phonebook?retryWrites=true&w=majority`

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phone = mongoose.model('contacts', phoneSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')
    if (process.argv.length === 3) {
        Phone.find({}).then(result => {
            result.forEach(note => {
              console.log(note.name + " " + note.number)
            })
             return mongoose.connection.close()
          })
    } else {
    const phone = new Phone({
      name: process.argv[3],
      number: process.argv[4],
    })

    return phone.save()
    }
  })
  .then(() => {
    if (process.argv.length !== 3) {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        return mongoose.connection.close()
    }
    
  })
  .catch((err) => console.log(err))
