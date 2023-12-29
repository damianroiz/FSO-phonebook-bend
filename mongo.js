const mongoose = require("mongoose");
require("dotenv").config();
////////////////////////////////////3.12

const url = process.env.MONGODB_URI
const [password, name, number] = process.argv.slice(2);

mongoose.set("strictQuery", false);
mongoose.connect(url).then(async () => {
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Person = mongoose.model("Person", personSchema);
  // const persons = [
  //   {
  //     name: "Arto Hellas",
  //     number: "040-123456",
  //   },
  //   {
  //     name: "Ada Lovelace",
  //     number: "39-44-5323523",
  //   },
  //   {
  //     name: "Dan Abramov",
  //     number: "12-43-234345",
  //   },
  //   {
  //     name: "Mary Poppendieck",
  //     number: "39-23-6423122",
  //   },
  // ];

  
  if (name && number) {
    const person = { name, number };

    try {
      const updatedPerson = await Person.findOneAndUpdate(
        { name: person.name },
        { $set: person },
        { upsert: true, new: true, runValidators: true }
      );
      console.log(
        `Added ${updatedPerson.name} number ${updatedPerson.number} to Phonebook`
      );
    } catch (error) {
      console.log(error);
    }
    mongoose.connection.close();
  }

  if (password && !name || !number) {
    try {
      const result = await Person.find({});
      console.log("Phonebook:");
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
    } catch (error) {
      console.log(error);
    }
  }
  mongoose.connection.close();
});
