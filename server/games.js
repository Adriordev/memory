const crypto = require("crypto");
const { getImages } = require("./services/getImages");
const { shuffle } = require("./helpers/arrayHelpers");

const createGame = async (
  userId,
  userName,
  couples,
  singlePlayerMode,
  gameDificulty
) => {
  const randomId = () => crypto.randomBytes(8).toString("hex");
  const gameId = randomId();
  const cards = [];

  let score = [
    {
      userId: userId,
      userName: userName,
      foundCards: [],
    },
  ];
  let turn = null;

  

  if (singlePlayerMode === "playerVsComputer") {
    score.push({
      userId: "computer",
      userName: "Computer",
      foundCards: [],
    });
    const turnIndex = Math.floor(Math.random() * (2 - 0)) + 0;
    turn = score[turnIndex].userId;
  }
  if (singlePlayerMode === "playAlone") {
    turn = score[0].userId;
  }
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
    gameDificulty,
    shownCards,
    isGameOver,
  };
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
  saveGame,
  findGame,
};
