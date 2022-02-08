export const computerPlayGame = (
  computerCardId,
  cards,
  gameDificulty,
  shownCards,
  getRandomIndex
) => {
  
  const possibleCards = cards.filter((c) => !c.isHidden && !c.isFlipped);
  
  switch (gameDificulty) {
    case "easy":
      SkynetEasyMode(computerCardId, getRandomIndex, possibleCards);
      break;
    case "normal":
      skynetNormalMode(
        computerCardId,
        cards,
        shownCards,
        getRandomIndex,
        possibleCards
      );
      break;
    case "hard":
      SkynetHardMode(
        computerCardId,
        cards,
        shownCards,
        getRandomIndex,
        possibleCards
      );
      break;
    default:
      break;
  }
};

const SkynetEasyMode = (computerCardId, getRandomIndex, possibleCards) => {
  const randomCardIndex = getRandomIndex(possibleCards);
  computerCardId.value = possibleCards[randomCardIndex].id;
};

const skynetNormalMode = (
  computerCardId,
  cards,
  shownCards,
  getRandomIndex,
  possibleCards
) => {
  const flippedCards = cards.filter((c) => c.isFlipped);
  if (flippedCards.length == 0) {
    SkynetEasyMode(computerCardId, getRandomIndex, possibleCards);
  } else {
    const previousFlippedCard = cards.find((c) => c.isFlipped);

    const shownCouple = shownCards.find(
      (card) =>
        card.img === previousFlippedCard.img &&
        card.id !== previousFlippedCard.id
    );
    if (shownCouple) {
      computerCardId.value = shownCouple.id;
    } else {
      const getIdsShownCards = shownCards.map((r) => r.id);
      const restCards = possibleCards.filter(
        (val) => !getIdsShownCards.includes(val.id)
      );
      computerCardId.value = restCards[0].id;
    }
  }
};

const SkynetHardMode = (
  computerCardId,
  cards,
  shownCards,
  getRandomIndex,
  possibleCards
) => {
  const shownCardsCanFlip = shownCards.filter((c) => !c.isHidden);
  if (shownCardsCanFlip) {
    const cardsGroupedByImg = getCardsGroupedByImg(shownCardsCanFlip);
    const shownCoupleFound = checkCouplesShown(
      cardsGroupedByImg,
      computerCardId
    );
    if (shownCoupleFound) {
      return;
    }
  }
  skynetNormalMode(
    computerCardId,
    cards,
    shownCards,
    getRandomIndex,
    possibleCards
  );
};

const getCardsGroupedByImg = (shownCardsCanFlip) => {
  const cardsGroupedByImg = {};
  for (let i = 0; i < shownCardsCanFlip.length; i++) {
    if (shownCardsCanFlip[i].img in cardsGroupedByImg) {
      const getIdsCardsGrupedByImg = cardsGroupedByImg[
        shownCardsCanFlip[i].img
      ].map((cards) => cards.id);
      const checkDuplicateIds = getIdsCardsGrupedByImg.find(
        (card) => card === shownCardsCanFlip[i].id
      );
      if (!checkDuplicateIds) {
        cardsGroupedByImg[shownCardsCanFlip[i].img].push(shownCardsCanFlip[i]);
      }
    } else {
      cardsGroupedByImg[shownCardsCanFlip[i].img] = [shownCardsCanFlip[i]];
    }
  }
  return cardsGroupedByImg;
};

const checkCouplesShown = (cardsGroupedByImg, computerCardId) => {
  for (let key in cardsGroupedByImg) {
    let cardsWithSameImg = cardsGroupedByImg[key];
    if (cardsWithSameImg.length !== 2) {
      return;
    } else {
      computerCardId.value = cardsWithSameImg[0].id;
    }
  }
};
