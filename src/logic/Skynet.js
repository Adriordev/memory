export const computerPlayGame = (
  cards,
  gameDificulty,
  cardsShown,
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
        cardsShown,
        getRandomIndex,
        possibleCards,
        computerCardstoFlip
      );
      break;
    case "hard":
      SkynetHardMode(
        cardsShown,
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
  cardsShown,
  getRandomIndex,
  possibleCards,
  computerCardstoFlip
) => {
  const randomCardIndex = getRandomIndex(possibleCards);
  computerCardstoFlip.push(possibleCards[randomCardIndex].id);
  const coupleShown = cardsShown.value.find(
    (card) =>
      card.img === possibleCards[randomCardIndex].img &&
      card.id !== possibleCards[randomCardIndex].id
  );
  if (coupleShown) {
    computerCardstoFlip.push(coupleShown.id);
  } else {
    possibleCards.splice(randomCardIndex, 1);
    const getIdsCardsShown = cardsShown.value.map((r) => r.id);
    const restCards = possibleCards.filter(
      (val) => !getIdsCardsShown.includes(val.id)
    );
    computerCardstoFlip.push(restCards[0].id);
  }
};

const SkynetHardMode = (
  cardsShown,
  getRandomIndex,
  possibleCards,
  computerCardstoFlip
) => {
  const cardsShownCanFlip = cardsShown.value.filter((c) => !c.isHidden);
  if (cardsShownCanFlip) {
    const cardsGroupedByImg = getCardsGroupedByImg(cardsShownCanFlip);
    const foundCoupleShown = checkCouplesShown(
      cardsGroupedByImg,
      computerCardstoFlip
    );
    if (foundCoupleShown) {
      return;
    }
  }
  skynetNormalMode(
    cardsShown,
    getRandomIndex,
    possibleCards,
    computerCardstoFlip
  );
};

const getCardsGroupedByImg = (cardsShownCanFlip) => {
  const cardsGroupedByImg = {};
  for (let i = 0; i < cardsShownCanFlip.length; i++) {
    if (cardsShownCanFlip[i].img in cardsGroupedByImg) {
      const getIdsCardsGrupedByImg = cardsGroupedByImg[
        cardsShownCanFlip[i].img
      ].map((cards) => cards.id);
      const checkDuplicateIds = getIdsCardsGrupedByImg.find(
        (card) => card === cardsShownCanFlip[i].id
      );
      if (!checkDuplicateIds) {
        cardsGroupedByImg[cardsShownCanFlip[i].img].push(cardsShownCanFlip[i]);
      }
    } else {
      cardsGroupedByImg[cardsShownCanFlip[i].img] = [cardsShownCanFlip[i]];
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
