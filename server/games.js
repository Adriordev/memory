const crypto = require("crypto");
const { getImages } = require("./services/getImages");
const { shuffle } = require("./helpers/arrayHelpers");

const createGame = async (userId, couples) => {
  const gameId = crypto.randomBytes(8).toString("hex");
  const cards = [];
  const score = [
    {
      userId: userId,
      foundCards: [],
    },
  ];
  const turn = null;
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
  return { gameId, cards, score, turn };
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
