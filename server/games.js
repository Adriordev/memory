const crypto = require("crypto");
const { getImages } = require("./services/getImages");
const { shuffle } = require("./helpers/arrayHelpers");

const createGame = async (couples, gameMode, gameDificulty) => {
  const randomId = () => crypto.randomBytes(8).toString("hex");
  const gameId = randomId();
  const cards = [];

  let score = [];
  let turn = null;

  let isStarted = false;

  const shownCards = [];

  const isGameOver = false;

  const images = await getImages(couples);

  for (let index = 0; index < images.length; index++) {
    const cardA = {
      id: `${index}A`,
      isFlipped: false,
      isHidden: false,
      img: images[index],
    };
    cards.push(cardA);

    const cardB = {
      id: `${index}B`,
      isFlipped: false,
      isHidden: false,
      img: images[index],
    };
    cards.push(cardB);
  }
  shuffle(cards);
  return {
    gameId,
    cards,
    score,
    turn,
    gameMode,
    gameDificulty,
    shownCards,
    isGameOver,
    isStarted,
  };
};

const addPlayerToGame = (game, userId, userName) => {
  game.score.push({
    userId: userId,
    userName: userName,
    foundCards: [],
  });
  if (game.gameMode === "singleplayer") {
    game.score.push({
      userId: "computer",
      userName: "Computer",
      foundCards: [],
    });
  }
  if (game.gameMode === "practice") {
    game.turn = game.score[0].userId;
    game.isStarted = true;
  }
  if (game.score.length == 2) {
    const turnIndex = Math.floor(Math.random() * (2 - 0)) + 0;
    game.turn = game.score[turnIndex].userId;
    game.isStarted = true;
  }
};

const games = new Map();

const saveGame = (game) => {
  games.set(game.gameId, game);
};

const findGame = (gameId) => {
  return games.get(gameId);
};

module.exports = {
  createGame,
  addPlayerToGame,
  saveGame,
  findGame,
};
