//process.loadEnvFile();

const mongoose = require('mongoose')
//const db_username = process.env.DB_USERNAME
//const db_password = process.env.DB_PASSWORD


if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackopen:${password}@fullstackopen.1lfkm6u.mongodb.net/phonebook?appName=fullstackopen`
mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
    name: String,
    phone: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 5){

  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: phone,
  })

  person.save().then(result => {
    console.log(`added ${name} number ${Number} to phonebook`)
    mongoose.connection.close()
  })
} 
else if (process.argv.length == 3){
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}
