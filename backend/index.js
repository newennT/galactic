console.log("Node backend starting...");

const express = require("express");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const app = express();

const { success } = require("./helper");

// Middleware
app
.use(favicon(__dirname + "/favicon.ico"))
.use(morgan("dev"));

// Routes
let pokemons = require("./data-mock");
app.get("/", (req, res) => {
  res.send("Reprendre le cours à 2:10");
});

app.get("/api/chapters", (req, res) => {
  res.json(success("Liste des pokemons", pokemons));
});

app.get("/api/chapters/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemon = pokemons.find(pokemon => pokemon.id === id);
  const message = "Un pokemon a été trouvé"
  res.json(success(message, pokemon));
});


// Server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});