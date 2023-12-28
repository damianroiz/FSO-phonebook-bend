const express = require("express");
const morgan = require("morgan"); //// 3.7
const cors = require("cors");
const app = express();
const Person = require("./models/Person");

// app.use(morgan("combined"));
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

require("dotenv").config();

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

//////////// 3.1
const persons = [
  // {
  //   id: 1,
  //   name: "Arto Hellas",
  //   number: "040-123456",
  // },
  // {
  //   id: 2,
  //   name: "Ada Lovelace",
  //   number: "39-44-5323523",
  // },
  // {
  //   id: 3,
  //   name: "Dan Abramov",
  //   number: "12-43-234345",
  // },
  // {
  //   id: 4,
  //   name: "Mary Poppendieck",
  //   number: "39-23-6423122",
  // },
];

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

app.post("/api/persons", async (request, response) => {
  const body = request.body;
  const persons = await Person.find({}).then((persons) =>
    response.json(persons)
  );
  // let id;
  // do {
  //   id = Math.floor(Math.random() * 100000) + 1;
  // } while (persons.find((person) => person.id === id));
  // Person.find({}).then((persons) => {
  //   response.json(persons);
  // });

  ///////////////// 3.6
  ////////////// error handlers
  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  if (!body.name) {
    return response.status(400).json({
      error: "name is missing",
    });
  }
  if (!body.number) {
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
  // const newPerson = { id, ...body };
  // persons.push(newPerson);

  // response.json(newPerson);
});

////////////// 3.3
app.get("/api/persons/:id", (request, response) => {
  // const id = +request.params.id;
  // const person = persons.find((person) => person.id === id);

  // if (person) {
  //   response.json(person);
  // } else {
  //   response.status(404).end();
  // }
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

/////////////////////// 3.4
app.delete("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
