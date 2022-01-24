const crypto = require("crypto");
const { getImages } = require("./services/getImages");
const { shuffle } = require("./helpers/arrayHelpers");

const createGame = async (userId, userName, couples) => {
  const gameId = crypto.randomBytes(8).toString("hex");
  const cards = [];
  const score = [
    {
      userId: userId,
      userName: userName,
      foundCards: [],
    },
  ];
  const turn = null;
  const isGameOver = false
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
  return { gameId, cards, score, turn, isGameOver };
};

const games = new Map();

const saveGame = (gameId, game) => {
  games.set(gameId, game);
};
const findGame = (gameId) => {
  return games.get(gameId);
};

module.exports = {
  createGame,
  saveGame,
  findGame,
};
