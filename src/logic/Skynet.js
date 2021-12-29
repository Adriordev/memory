export const computerPlayGame = (
  cards,
  gameDificulty,
  shownCards,
  getRandomIndex
) => {
  const computerCardstoFlip = [];
  const possibleCards = cards.value.filter((c) => !c.isHidden);
  switch (gameDificulty) {
    case "easy":
      SkynetEasyMode(getRandomIndex, possibleCards, computerCardstoFlip);
      break;
    case "normal":
      skynetNormalMode(
        shownCards,
        getRandomIndex,
        possibleCards,
        computerCardstoFlip
      );
      break;
    case "hard":
      SkynetHardMode(
        shownCards,
        getRandomIndex,
        possibleCards,
        computerCardstoFlip
      );
      break;
    default:
      break;
  }
  return computerCardstoFlip;
};

const SkynetEasyMode = (getRandomIndex, possibleCards, computerCardstoFlip) => {
  for (let index = 0; index < 2; index++) {
    const randomCardIndex = getRandomIndex(possibleCards);
    computerCardstoFlip.push(possibleCards[randomCardIndex].id);
    possibleCards.splice(randomCardIndex, 1);
  }
};

const skynetNormalMode = (
  shownCards,
  getRandomIndex,
  possibleCards,
  computerCardstoFlip
) => {
  const randomCardIndex = getRandomIndex(possibleCards);
  computerCardstoFlip.push(possibleCards[randomCardIndex].id);
  const shownCouple = shownCards.value.find(
    (card) =>
      card.img === possibleCards[randomCardIndex].img &&
      card.id !== possibleCards[randomCardIndex].id
  );
  if (shownCouple) {
    computerCardstoFlip.push(shownCouple.id);
  } else {
    possibleCards.splice(randomCardIndex, 1);
    const getIdsShownCards = shownCards.value.map((r) => r.id);
    const restCards = possibleCards.filter(
      (val) => !getIdsShownCards.includes(val.id)
    );
    computerCardstoFlip.push(restCards[0].id);
  }
};

const SkynetHardMode = (
  shownCards,
  getRandomIndex,
  possibleCards,
  computerCardstoFlip
) => {
  const shownCardsCanFlip = shownCards.value.filter((c) => !c.isHidden);
  if (shownCardsCanFlip) {
    const cardsGroupedByImg = getCardsGroupedByImg(shownCardsCanFlip);
    const shownCoupleFound = checkCouplesShown(
      cardsGroupedByImg,
      computerCardstoFlip
    );
    if (shownCoupleFound) {
      return;
    }
  }
  skynetNormalMode(
    shownCards,
    getRandomIndex,
    possibleCards,
    computerCardstoFlip
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

const checkCouplesShown = (cardsGroupedByImg, computerCardstoFlip) => {
  for (let key in cardsGroupedByImg) {
    let cardsWithSameImg = cardsGroupedByImg[key];
    if (cardsWithSameImg.length !== 2) {
      return;
    } else {
      for (let index = 0; index < cardsWithSameImg.length; index++) {
        computerCardstoFlip.push(cardsWithSameImg[index].id);
      }
      return computerCardstoFlip;
    }
  }
};
