const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const serveStatic = require('serve-static')
const path = require('path')

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

app.use('/', serveStatic(path.join(__dirname, '/dist')))

app.get(/.*/, function (req, res) {
	res.sendFile(path.join(__dirname, '/dist/index.html'))
})

const PORT = process.env.PORT || 3000;

const { saveSession, loadSession } = require("./session");
const { createGame, addPlayerToGame, saveGame, findGame } = require("./games");
const {
  flipCard,
  checkIfCoupleWasFound,
  checkGameOver,
} = require("./gameActions");

const crypto = require("crypto");

const randomId = () => crypto.randomBytes(8).toString("hex");

let gameSocket = io.of(/^\/game\/\w+$/);

//----INIT USERS middleware----
gameSocket.use((socket, next) => {
  const sessionId = socket.handshake.auth.sessionId;
  if (sessionId) {
    const sessionLoaded = loadSession(sessionId);
    if (sessionLoaded) {
      socket.sessionId = sessionId;
      socket.userId = sessionLoaded.userId;
      socket.userName = sessionLoaded.userName;
    }
    return next();
  }
  const userName = socket.handshake.auth.userName;
  socket.sessionId = randomId();
  socket.userId = randomId();
  socket.userName = userName;
  next();
});
//----FINISH USERS middlware----

//----INIT USERS connection----
gameSocket.on("connection", (socket) => {
  console.log("connected");
  saveSession(socket.sessionId, {
    userId: socket.userId,
    userName: socket.userName,
  });


  socket.emit("session", {
    sessionId: socket.sessionId,
    userId: socket.userId,
    userName: socket.userName,
  });
  //----FINISH USERS connection----

  //---- GAMES ACTIONS----
  socket.on("joinGame", (gameId) => {
    const game = findGame(gameId);
    console.log(findGame(gameId));
    if (game.isStarted) {
      socket.nsp.emit("startGame", game);
    }
  });

  socket.on("flipCard", ({ cardId, gameId, userId }) => {
    let game = findGame(gameId);

    let flippedCards = game.cards.filter((c) => c.isFlipped);

    if (game.turn !== userId || flippedCards.length > 1) return;

    flipCard(cardId, game);

    saveGame(game);

    socket.nsp.emit("updateFlippedCard", game);

    flippedCards = game.cards.filter((c) => c.isFlipped);
    if (flippedCards.length == 2) {
      checkIfCoupleWasFound(game);

      socket.nsp.emit("resetFlippedCards", flippedCards);

      checkGameOver(game);

      saveGame(game);

      socket.nsp.emit("updateGame", game);
    }
  });
  //----FINISH GAMES ACTIONS----
});
app.post("/api/game", async (req, res) => {
  const { couplesCount, gameMode, gameDificulty } = req.body;
  const game = await createGame(couplesCount, gameMode, gameDificulty);
  saveGame(game);
  res.send(game.gameId);
});

app.put("/api/game/:id", (req, res) => {
  const { userId, userName } = req.body;
  const gameId = req.params.id;
  const game = findGame(gameId);
  const isUserAlreadyRegister = game.score.some(
    (score) => score.userId === userId
  );
  if (game.isStarted && !isUserAlreadyRegister) {
    return res.status(401).send({ error: "The game is full" });
  }
  if (!game.isStarted && !isUserAlreadyRegister) {
    addPlayerToGame(game, userId, userName);
    saveGame(game);
  }
  res.send(game.gameId);
});

server.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`);
});
