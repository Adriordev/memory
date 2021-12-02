export const computerPlayGame = (
  cards,
  gameDificulty,
  cardsShown,
  getRandomIndex
) => {
  const computerCardstoFlip = [];
  const possibleCards = cards.value.filter((card) => !card.isHidden);
  //init hard mode
  if (gameDificulty === "hard") {
    const randomCardIndex = getRandomIndex(possibleCards);
    computerCardstoFlip.push(possibleCards[randomCardIndex].id);
    const coupleShown = cardsShown.value.find((card) => {
      return (
        card.img === possibleCards[randomCardIndex].img &&
        card.id !== possibleCards[randomCardIndex].id
      );
    });
    if (coupleShown) {
      computerCardstoFlip.push(coupleShown.id);
    } else {
      possibleCards.splice(randomCardIndex, 1);
      computerCardstoFlip.push(possibleCards[getRandomIndex(possibleCards)].id);
    }
    //finish hard mode
  } else {
    //init normal mode
    for (let index = 0; index < 2; index++) {
      const randomCardIndex = getRandomIndex(possibleCards);
      computerCardstoFlip.push(possibleCards[randomCardIndex].id);
      possibleCards.splice(randomCardIndex, 1);
    }
    //finish normal mode
  }
  return computerCardstoFlip;
};
