const express = require("express");
const { createServer } = require("http");
const socketIoLib = require("socket.io");
const Player = require("./Player").default;
const Game = require("./Game").default;
const { join } = require("path");

const app = express();
const server = createServer(app);
const io = socketIoLib(server);

app.get("/player", (req, res) => {
  res.sendFile(join(__dirname, "player.html"));
});

app.get("/dealer", (req, res) => {
  res.sendFile(join(__dirname, "dealer.html"));
});

let players = {};
let game = {};

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.on("joinGame", (playerName) => {
    console.log("jg " + playerName);
    if (playerName == null) return;
    console.log(`${playerName} has joined game`);

    if (playerExists(playerName)) return;

    if (Object.keys(players).length < 2) {
      let id = socket.id;
      console.log("id " + id);
      players[id] = new Player(1000, playerName);
      console.log("pl " + JSON.stringify(players));
      io.emit("message", `${playerName} has joined the game.`);
      if (Object.keys(players).length == 2) {
        startGame();
      }
    } else {
      socket.emit("message", "The game is full.");
    }
  });

  function playerExists(nameToCheck) {
    return Object.values(players).some(
      (nestedObj) => nestedObj.name === nameToCheck
    );
  }

  socket.on("playerAction", (action) => {
    const playerId = socket.id;
    const player = players[playerId];
    console.log("playerAction " + action);
    game.playerAction(player, action.action, action.amount);
    let gameState = game.gameState;
    gameState["players"] = players;
    io.emit("gameState", game.gameState);
  });

  socket.on("startGame", () => {
    startGame();
  });

  function startGame() {
    console.log("sg");

    if (Object.values(players).length === 2) {
      game = new Game(Object.values(players)[0], Object.values(players)[1]);
      game.dealInitialCards();
      let gameState = game.gameState;
      gameState["players"] = players;
      io.emit("message", "The game has started!");
    } else {
      socket.emit("message", "Need two players to start the game.");
    }
    let gameState = game.gameState;
    gameState["players"] = players;
    console.log("gamestate " + JSON.stringify(game.gameState));
    io.emit("gameState", game.gameState);
  }

  socket.on("showdown", () => {
    console.log("showdown");
    game.evaluateHands();
    let gameState = game.gameState;
    gameState["players"] = players;
    io.emit("gameState", game.gameState);
  });

  socket.on("newGame", () => {
    console.log("newGame");
    game.newGame();
    let gameState = game.gameState;
    gameState["players"] = players;
    io.emit("gameState", game.gameState);
  });

  socket.on("dealerAction", () => {
    console.log("dealerAction " + JSON.stringify(game.gameState));
    if (
      game.gameState.communityCards == null ||
      game.gameState.communityCards.length == 0
    )
      game.dealFlop();
    else if (game.gameState.communityCards.length <= 5) {
      game.dealTurnOrRiver();
    }
    let gameState = game.gameState;
    gameState["players"] = players;
    io.emit("gameState", game.gameState);
  });

  socket.on("disconnect", () => {
    console.log("disconnect " + JSON.stringify(players));
    if (players[socket.id] == null) return;
    console.log("sock " + socket.id);
    console.log("play " + JSON.stringify(players[socket.id]));
    console.log("name " + players[socket.id].name);
    //game.leaveGame(players[socket.id].name.toString());
    let gameState = game.gameState;
    console.log("gamestate " + gameState);
    if (gameState) {
      game.leaveGame("0x216F3F71Add8F2C3C9e19fA9b463b6031D5A14b9");
    }
    delete players[socket.id];
    console.log("User disconnected: " + socket.id);
    io.emit("message", "A player has left the game.");
  });

  socket.on("leaveGame", () => {
    console.log("disconnect " + JSON.stringify(players));
    if (players[socket.id] == null) return;
    console.log("sock " + socket.id);
    console.log("play " + JSON.stringify(players[socket.id]));
    console.log("name " + players[socket.id].name);
    //game.leaveGame(players[socket.id].name.toString());
    let gameState = game.gameState;
    console.log("gamestate " + gameState);
    if (gameState) {
      game.leaveGame("0x216F3F71Add8F2C3C9e19fA9b463b6031D5A14b9");
    }
    delete players[socket.id];
    console.log("User disconnected: " + socket.id);
    io.emit("message", "A player has left the game.");
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
