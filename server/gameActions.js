const { sleep } = require("./helpers/sleepHelper");

const flipCard = async (cardId, game) => {
  const selectCardtoFlip = game.cards.find((c) => c.id === cardId);
  selectCardtoFlip.isFlipped = true;

  return game;
};
const checkIfCoupleWasFound = async (game) => {
  const flippedCards = game.cards.filter((c) => c.isFlipped);
  const coupleFound = flippedCards[0].img === flippedCards[1].img;
  const scores = game.score.map((s) => s);

  const resetFlippedCards = async (flippedCards) => {
    await sleep(2000);
    flippedCards.forEach((element) => {
      element.isFlipped = false;
    });
  };

  if (coupleFound) {
    const player = scores.find((p) => p.userId === game.turn);
    player.foundCards.push(flippedCards[0].img);
    flippedCards.forEach((element) => {
      element.isHidden = true;
    });
    await resetFlippedCards(flippedCards);
  } else {
    await resetFlippedCards(flippedCards);
    const opponent = scores.find((p) => p.userId !== game.turn);
    game.turn = opponent.userId;
  }
  return game;
};

module.exports = { flipCard, checkIfCoupleWasFound };
