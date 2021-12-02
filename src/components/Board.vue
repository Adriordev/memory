<template>
  <div class="generate-board" v-if="!score && !endGame">
    <label for="couplesCount">Numer of couples</label>
    <br />
    <input type="number" v-model="couplesCount" @keyup.enter="createCards" />
    <br />
    <br />
    <label for="normal">Normal</label>
    <input
      type="radio"
      name="gameDificulty"
      value="normal"
      v-model="gameDificulty"
    />
    <label for="hard">Hard</label>
    <input
      type="radio"
      name="gameDificulty"
      value="hard"
      v-model="gameDificulty"
    />
    <br />
    <br />
    <button @click="createCards">Create</button>
  </div>
  <div v-if="score">
    <Score v-bind="score" :endGame="endGame" :turnComputer="turnComputer" />
    <button @click="handleReset">Reset game</button>
  </div>
  <div
    class="board-container"
    :class="{ 'not-pointer': userCannotFlipCard }"
    v-if="!endGame"
  >
    <Card
      v-bind="card"
      @handleFlip="flipCard"
      v-for="card in cards"
      :key="card.id"
    />
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { shuffle } from "../helpers/arrayHelpers";
import { sleep } from "../helpers/sleepHelper";
import { computerPlayGame } from "../logic/Skynet";
import { getImages } from "../services/getImages";
import Card from "./Card.vue";
import Score from "./Score.vue";
export default {
  components: {
    Card,
    Score,
  },
  emits: ["handleReset"],
  setup(props, context) {
    // State

    const couplesCount = ref();
    const gameDificulty = ref("normal");
    const cards = ref([]);
    const score = ref(); //depende del modo de juego que queramos crear, si es por rondas o por juegos independientes
    const turnComputer = ref(false);
    const cardsShown = ref([]);
    const endGame = ref(false);

    // Computed

    const flippedCards = computed(() => cards.value.filter((c) => c.isFlipped));
    const userCannotFlipCard = computed(
      () => turnComputer.value || flippedCards.value.length == 2
    );
    const hiddenCards = computed(() => cards.value.filter((c) => c.isHidden));

    // Functions

    const handleReset = () => {
      context.emit("handleReset");
    };

    const createCards = async () => {
      cards.value = [];
      score.value = {
        player: 0,
        cardsPlayer: [],
        computer: 0,
        cardsComputer: [],
      };
      turnComputer.value = false;
      cardsShown.value = [];
      endGame.value = false;

      const images = await getImages(couplesCount.value);

      for (let index = 0; index < images.length; index++) {
        const cardA = {
          id: `${index}A`,
          text: index,
          isFlipped: false,
          isHidden: false,
          img: images[index],
        };
        cards.value.push(cardA);

        const cardB = {
          id: `${index}B`,
          text: index,
          isFlipped: false,
          isHidden: false,
          img: images[index],
        };
        cards.value.push(cardB);
      }
      shuffle(cards.value);
    };

    const flipCard = async (id) => {
      const selectCardtoFlip = cards.value.find((c) => c.id === id);
      selectCardtoFlip.isFlipped = true;

      await checkIfCoupleWasFound();
    };

    const checkIfCoupleWasFound = async () => {
      if (flippedCards.value.length < 2) return;

      flippedCards.value.forEach((element) => {
        cardsShown.value.push(element);
      });

      const coupleFound =
        flippedCards.value[0].img === flippedCards.value[1].img;
      if (coupleFound) {
        if (turnComputer.value) {
          score.value.computer += 1;
          score.value.cardsComputer.push(flippedCards.value[0].img);
        } else {
          score.value.player += 1;
          score.value.cardsPlayer.push(flippedCards.value[0].img);
        }
        flippedCards.value.forEach((element) => {
          element.isHidden = true;
        });
      } else {
        turnComputer.value = !turnComputer.value;
      }

      await sleep(2000);

      flippedCards.value.forEach((element) => {
        element.isFlipped = false;
      });
      if (hiddenCards.value.length === couplesCount.value * 2) {
        endGame.value = true;
        return;
      }
      if (turnComputer.value) {
        await sleep(2000);
        const cardsToFlip = computerPlayGame(cards, gameDificulty, cardsShown);
        for (let index = 0; index < cardsToFlip.length; index++) {
          flipCard(cardsToFlip[index]);
          await sleep(500);
        }
      }
    };

    return {
      handleReset,
      couplesCount,
      gameDificulty,
      cards,
      createCards,
      flipCard,
      Card,
      score,
      Score,
      computerPlayGame,
      turnComputer,
      userCannotFlipCard,
      endGame,
    };
  },
};
</script>

<style>
.generate-board {
  padding: 15px 0px 15px 0px;
}
.board-container {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
  margin: 1em;
  padding: 1em;
}
.board-container.not-pointer {
  pointer-events: none;
  cursor: not-allowed;
}
</style>
