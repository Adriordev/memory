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

const port = 3000;

const { saveSession, loadSession } = require("./session");
const { createGame, saveGame, findGame } = require("./games");
const { flipCard, checkIfCoupleWasFound } = require("./gameActions");
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
  socket.on("createGame", async ({ userId, couples }) => {
    if (couples <= 0 || couples === "") {
      socket.emit('catch_error', {err: 'invalid couples'} )
      return
    }
    const newGame = await createGame(userId, couples);
    const gameId = newGame.gameId;
    socket.join(gameId);
    saveGame(gameId, newGame);
    console.log("game saved: " + gameId);
    socket.emit("generateCode", gameId);
  });

  socket.on("joinGame", ({ gameId, userId }) => {
    const game = findGame(gameId);
    if(game === undefined){
      socket.emit('catch_error', {err: 'invalid code'} )
      return
    }
    const isUserAlreadyRegister = game.score.some(
      (score) => score.userId === userId
    );
    if (!isUserAlreadyRegister) {
      game.score.push({ userId: userId, foundCards: [] });
      const turnIndex =  Math.floor(Math.random() * (2 - 0)) + 0
      game.turn = game.score[turnIndex].userId
      saveGame(gameId, game);
    }
    socket.join(gameId);
    if(game.score.length == 2){
      io.to(gameId).emit("updateGame", game);
    }return
    
  });

  socket.on("flipCard", async ({ cardId, gameId, userId }) => {
    //if(turn !== userId)return
    let game = findGame(gameId);
    let flippedCards = game.cards.filter((c) => c.isFlipped)
    
    if(game.turn !== userId || flippedCards.length > 1)return
    
    game = flipCard(cardId, game);
    
    saveGame(gameId, game);
    io.to(gameId).emit("updateGame", game); 

    flippedCards = game.cards.filter((c) => c.isFlipped)
    if (flippedCards.length == 2){
      game = await checkIfCoupleWasFound(game)

      saveGame(gameId, game);
      io.to(gameId).emit("updateGame", game);
    } 

  });
  //----FINISH GAMES ACTIONS----
});

server.listen(port, () => {
  console.log("listening on *:3000");
});
