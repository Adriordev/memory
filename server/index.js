const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const http = require("http");
const server = http.createServer(app);

const port = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to memory game");
});

server.listen(port, () => {
  console.log("listening on *:3000");
});
