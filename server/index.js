const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3000;

const { saveSession, loadSession } = require("./session");
const { createGame, saveGame, findGame } = require("./games");
const {
  flipCard,
  checkIfCoupleWasFound,
  checkGameOver,
} = require("./gameActions");

const crypto = require("crypto");

const randomId = () => crypto.randomBytes(8).toString("hex");

//----INIT USERS middleware----
io.use((socket, next) => {
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
  if (!userName) {
    return next(new Error("invalid userName"));
  }
  socket.sessionId = randomId();
  socket.userId = randomId();
  socket.userName = userName;
  next();
});
//----FINISH USERS middlware----

//----INIT USERS connection----
io.on("connection", (socket) => {
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

  
  socket.on('joinGameRoom', (game)=>{
    console.log('entro');
    socket.join(game.gameId)
  })
  /* socket.on("joinGame", ({ gameId, userId, userName }) => {
    const game = findGame(gameId);
    if (game === undefined) {
      socket.emit("catch_error", { err: "invalid code" });
      return;
    }
    const isUserAlreadyRegister = game.score.some(
      (score) => score.userId === userId
    );
    if (!isUserAlreadyRegister) {
      game.score.push({ userId: userId, userName: userName, foundCards: [] });
      const turnIndex = Math.floor(Math.random() * (2 - 0)) + 0;
      game.turn = game.score[turnIndex].userId;
      saveGame(game);
    }
    socket.join(gameId);
    if (game.score.length == 2) {
      io.to(gameId).emit("updateGame", game);
    }
    return;
  }); */
  socket.on('joinGameRoom', (game)=>{
    socket.join(game.gameId)
  })

  socket.on("flipCard", ({ cardId, gameId, userId }) => {
    
    let game = findGame(gameId);

    let flippedCards = game.cards.filter((c) => c.isFlipped);

    if (game.turn !== userId || flippedCards.length > 1) return;

    flipCard(cardId, game);

    saveGame(game);
    
    io.to(gameId).emit("updateFlippedCard", game);

    flippedCards = game.cards.filter((c) => c.isFlipped);
    if (flippedCards.length == 2) {
      checkIfCoupleWasFound(game);

      io.to(gameId).emit("resetFlippedCards", flippedCards);

      checkGameOver(game);

      saveGame(game);

      io.to(gameId).emit("updateGame", game);
    }
  });
  //----FINISH GAMES ACTIONS----
  
});
app.post("/api/game", async (req, res) => {
  const { userId, userName, couplesCount, singlePlayerMode, gameDificulty } =
    req.body;
  const game = await createGame(
    userId,
    userName,
    couplesCount,
    singlePlayerMode,
    gameDificulty
  );
  saveGame(game);
  res.send(game.gameId);
});

app.get("/api/game:id", (req, res) => {
  const gameId = req.params.id;
  const game = findGame(gameId);
  res.send(game);
});

server.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`);
});
