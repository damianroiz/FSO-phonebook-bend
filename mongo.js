const mongoose = require("mongoose");
require("dotenv").config();


const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.dyibbyi.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url).then(() => {
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });
  const Person = mongoose.model("Person", personSchema);

  const persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
    },
  ];

/**
 * Modifying the script to handle command line arguments
 * 
const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

if (process.argv.length < 5) {
  // If not enough arguments were provided, find all persons and log them
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else {
  // If name and number were provided, add or update the person
  const person = { name, number };

  Person.findOneAndUpdate(
    { name: person.name },
    { $set: person },
    { upsert: true, new: true, runValidators: true }
  )
  .then((updatedPerson) => {
    console.log(`Added or updated ${updatedPerson.name} number ${updatedPerson.number}`);
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log(error);
    mongoose.connection.close();
  });
}
 */

  const promises = persons.map((person) => {
    return Person.findOneAndUpdate(
      { name: person.name },
      { $set: person },
      { upsert: true, new: true, runValidators: true }
    );
  });

  Promise.all(promises)
    .then((updatedPersons) => {
      console.log(updatedPersons);
      mongoose.connection.close();
    })
    .catch((error) => {
      console.log(error);
      mongoose.connection.close;
    });

//   Person.find({}).then(result => {
//       result.forEach(person => {
//         console.log(person)
//       })
//       mongoose.connection.close()
//     })
});
