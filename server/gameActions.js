const { sleep } = require("./helpers/sleepHelper");

const flipCard = (cardId, game) => {
  const selectCardtoFlip = game.cards.find((c) => c.id === cardId);
  selectCardtoFlip.isFlipped = true;
};
const checkIfCoupleWasFound = async (game) => {
  const flippedCards = game.cards.filter((c) => c.isFlipped);
  const hiddenCards = game.cards.filter((c) => c.isHidden);
  const coupleFound = flippedCards[0].img === flippedCards[1].img;
  const scores = game.score.map((s) => s);

  const resetFlippedCards = async (flippedCards) => {
    await sleep(2000);
    flippedCards.forEach((element) => {
      element.isFlipped = false;
    });
  };

  if (coupleFound) {
    const userPlaying = scores.find((p) => p.userId === game.turn);
    userPlaying.foundCards.push(flippedCards[0].img);

    flippedCards.forEach((element) => {
      element.isHidden = true;
    });
    await resetFlippedCards(flippedCards);
  } else {
    await resetFlippedCards(flippedCards);
    const opponentUser = scores.find((p) => p.userId !== game.turn);
    game.turn = opponentUser.userId;
  }
  if (flippedCards.length == hiddenCards.length) {
    game.isGameOver = true;
  }
};

module.exports = { flipCard, checkIfCoupleWasFound };
