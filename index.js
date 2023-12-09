const express = require("express");
const morgan = require("morgan"); //// 3.7 
const cors = require("cors")


const app = express();
app.use(express.json());

// app.use(morgan("combined"));
app.use(cors())


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
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

//////////// 3.1
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

////////// 3.2
app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${(date =
      new Date())}</p>`
  );
});

////////////// 3.3
app.get("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

/////////////////////// 3.4
app.delete("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

/////////////// 3.5

app.post("/api/persons", (request, response) => {
  let id;
  do {
    id = Math.floor(Math.random() * 100000) + 1;
  } while (persons.find((person) => person.id === id));

  const body = request.body;

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

  const newPerson = { id, ...body };
  persons.push(newPerson);

  response.json(newPerson);
});

// old solution for 3.5
// const idGenerator = () => {
//   const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
//   return maxId + 1;
// };

// app.post("/api/persons", (request, response) => {
//   const body = request.body;

//   if (!body.name || !body.number) {
//     return response.status(400).json({
//       error: "content missing",
//     });
//   }

//   const person = {
//     id: idGenerator(),
//     name: body.name,
//     number: body.number,
//   };

//   persons = persons.concat(person);

//   response.json(person);
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
