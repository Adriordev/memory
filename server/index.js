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
const { createGame, saveGame, loadGame } = require("./game");
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

app.put("/api/game", async (req, res) => {
  const data = req.body;
  const newGame = await createGame(data.couples, data.userId);
  saveGame(newGame.gameId, newGame);
  res.send(newGame);
});
app.put("/api/game/:gameId", (req, res) => {
  const gameId = req.params.gameId;
  const userId = req.body.userId
  const getGame = loadGame(gameId, userId);
  console.log(getGame);
  if (getGame === undefined) {
    res.status(404).send("Game not found");
  }
  res.send(getGame);
});

//First connection
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

  socket.on("joinGame", (data) => {
    io.in(data.joinGame)
      .allSockets()
      .then((res) => {
        if (res.size === 2) {
          io.to(data.joinGame).emit("");
        }
      });
  });
});

server.listen(port, () => {
  console.log("listening on *:3000");
});
