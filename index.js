const express = require("express");
const morgan = require("morgan"); //// 3.7
const cors = require("cors");
const app = express();
const Person = require("./models/Person");
require("dotenv").config();

// app.use(morgan("combined"));
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

const [password, name, number] = process.argv.slice(2);

//////////////////////////
////// 3.8
morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(
  morgan(
    ":method :url :status - :res[content-length] - :response-time ms - :body", // Include the "request-body" token in the log format
    {
      skip: (req) => req.method !== "POST",
    }
  )
);

//////////// 3.13
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

////////// 3.2
app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${(date =
      new Date())}</p>`
  );
});

/////////////// 3.5
///////////////////// 3.14
app.post("/api/persons", async (request, response) => {
  const body = request.body;
  const persons = await Person.find({});
  response.json(persons);

  ///////////////// 3.6
  ////////////// error handlers
  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  if (!body.content || body.content.trim() === "") {
    return response.status(400).json({
      error: "content missing",
    });
  }
  if (!body.name || body.name.trim() === "") {
    return response.status(400).json({
      error: "name is missing",
    });
  }
  if (!body.number || body.number.trim() === "") {
    return response.status(400).json({
      error: "number is missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

////////////// 3.3
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      person ? response.json(person) : response.status(400).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  if (!body.name || body.name.trim() === "") {
    return response.status(400).json({
      error: "name is missing",
    });
  }
  if (!body.number || body.number.trim() === "") {
    return response.status(400).json({
      error: "number is missing",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

//////////////////////// 3.15
/////////////////////// 3.4
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

/////////////////////// 3.16
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  error.name === "CastError" &&
    response.status(400).send({ eror: "malformatted id" });
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
