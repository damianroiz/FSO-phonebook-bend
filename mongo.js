const mongoose = require("mongoose");
require("dotenv").config();
////////////////////////////////////3.12
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

  const password = process.argv[2];
  const name = process.argv[3];
  const number = process.argv[4];

  if (name && number) {
    const person = { name, number };

    Person.findOneAndUpdate(
      { name: person.name },
      { $set: person },
      { upsert: true, new: true, runValidators: true }
    )
      .then((updatedPerson) => {
        console.log(
          `Added ${updatedPerson.name} number ${updatedPerson.number} to Phonebook`
        );
        console.log(password);
        mongoose.connection.close();
      })
      .catch((error) => {
        console.log(error);
        mongoose.connection.close();
      });
  }

  if (password) {
    Person.find({})
      .then((result) => {
        console.log("Phonebook:");
        result.forEach((person) => {
          console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
      })
      .catch((error) => {
        console.log(error);
        mongoose.connection.close();
      });
  }
});
