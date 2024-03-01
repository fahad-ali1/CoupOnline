import mongoose from "mongoose";
import Player from "../model/players.model.js";
import Game from "../model/games.model.js";

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/couponline", {
});

// Create fake player data
const players = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    age: 25,
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    age: 30,
  },
  {
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    age: 28,
  },
  {
    firstName: "Todd",
    lastName: "Travis",
    email: "Todd@example.com",
    age: 25,
  },
];

// Create fake game data
const games = [
  {
    active: true,
    playerCount: 4,
    players: [],
    winner: null,
    rounds: [],
  },
  {
    active: false,
    playerCount: 4,
    players: [],
    winner: null,
    rounds: [],
  },
];

// Function to create players and add them to games
async function createPlayersAndGames() {
  try {
    // Create players
    const createdPlayers = await Player.create(players);

    // Assign players to games
    for (let i = 0; i < games.length; i++) {
      for (let j = 0; j < players.length; j++) {
        games[i].players.push({
          player: createdPlayers[j]._id,
          cardOne: 1,
          cardTwo: 2,
        });
      }
    }

    // Create games
    await Game.create(games);

    console.log("Sample data created successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error creating Sample data:", error);
  }
}

// Call the function to create players and games
createPlayersAndGames();