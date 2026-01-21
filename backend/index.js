console.log("Node backend starting...");

const express = require("express");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const app = express();

const { success } = require("./helper");
const { getUniqueId } = require("./helper");

// Middleware
app
.use(favicon(__dirname + "/favicon.ico"))
.use(morgan("dev"))
.use(bodyParser.json());

// Routes en GET
let pokemons = require("./data-mock");
app.get("/", (req, res) => {
  res.send("Reprendre le cours à 2:10 : https://www.youtube.com/watch?v=NRxzvpdduvQ");
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

// Routes de création
app.post("/api/chapters", (req, res) => {
  const id = getUniqueId(pokemons);
  const pokemonCreated = { ...req.body, ...{id: id, created: new Date()}}
  pokemons.push(pokemonCreated);
  const message = `Le pokemon ${pokemonCreated.name} a été créé !`
  res.json(success(message, pokemonCreated));
})

// Routes de modification
app.put("/api/chapters/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemonUpdated = { ...req.body, ...{id: id, created: new Date()} }
  pokemons = pokemons.map(pokemon => {
    return pokemon.id === id ? pokemonUpdated : pokemon
  })
  const message = `Le pokemon ${pokemonUpdated.name} a été modifié !`
  res.json(success(message, pokemonUpdated));
})

// Route de suppression
app.delete("/api/chapters/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id)
  pokemons = pokemons.filter(pokemon => pokemon.id !== id)
  const message = `Le pokemon ${pokemonDeleted.name} a été supprimé !`
  res.json(success(message, pokemonDeleted));
})



// Server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});