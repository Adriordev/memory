/* const { sleep } = require("./helpers/sleepHelper"); */

const flipCard = (cardId, game) => {
  const selectCardtoFlip = game.cards.find((c) => c.id === cardId);
  selectCardtoFlip.isFlipped = true;
  game.shownCards.push(selectCardtoFlip);
};

const checkIfCoupleWasFound = (game) => {
  const flippedCards = game.cards.filter((c) => c.isFlipped);
  const coupleFound = flippedCards[0].img === flippedCards[1].img;
  const scores = game.score.map((s) => s);

  if (coupleFound) {
    const userPlaying = scores.find((p) => p.userId === game.turn);
    userPlaying.foundCards.push(flippedCards[0].img);

    flippedCards.forEach((element) => {
      element.isHidden = true;
    });
    resetFlippedCards(flippedCards);
  } else {
    resetFlippedCards(flippedCards);
    const opponentUser = scores.find((p) => p.userId !== game.turn);
    if (opponentUser) {
      game.turn = opponentUser.userId;
    }
  }
};

const resetFlippedCards = (flippedCards) => {
  flippedCards.forEach((element) => {
    element.isFlipped = false;
  });
};

const checkGameOver = (game) => {
  const hiddenCards = game.cards.filter((c) => c.isHidden);
  if (hiddenCards.length == game.cards.length) {
    game.isGameOver = true;
  }
};

module.exports = {
  flipCard,
  checkIfCoupleWasFound,
  checkGameOver,
};
