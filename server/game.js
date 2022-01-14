const crypto = require("crypto");
const { getImages } = require("./services/getImages");
const { shuffle } = require("./helpers/arrayHelpers");
const games = new Map();
const createGame = async (couples, userId) => {
  const gameId = crypto.randomBytes(8).toString("hex");
  const cards = [];
  const score = [
    {
      userId: userId,
      foundCards: [],
    },
  ];

  /* shownCards.value = [];
  endGame.value = false; */

  const images = await getImages(couples);

  for (let index = 0; index < images.length; index++) {
    const cardA = {
      id: `${index}A`,
      text: index,
      isFlipped: false,
      isHidden: false,
      img: images[index],
    };
    cards.push(cardA);

    const cardB = {
      id: `${index}B`,
      text: index,
      isFlipped: false,
      isHidden: false,
      img: images[index],
    };
    cards.push(cardB);
  }
  shuffle(cards);
  return { cards, score, gameId };
};
const saveGame = (gameId, game) => {
  games.set(gameId, game);
};
const loadGame = (gameId, userId) => {
  const findGame = games.get(gameId);
  if (userId !== findGame.score[0].userId) {
    findGame.score.push({ userId: userId, foundCards: [] });
  }
  return findGame;
};
module.exports = { createGame, saveGame, loadGame };
