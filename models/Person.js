const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

///////// 3.20
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [5, "Name should be at least 5 characters long"],
    required: [true, 'Name is a required field'],
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => {
        return /^\d{2,3}-?\d{6,7}$/.test(v);
      },
      message: "Number format should be 10-100000 or 100-1000000",
    },
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
