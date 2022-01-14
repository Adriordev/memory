<template>
  <div class="board">
    <div v-if="score" class="score-container">
      <Score
        v-bind="score"
        :end-game="endGame"
        :turn-computer="turnComputer"
        :is-play-alone="isPlayAlone"
      />
      <button @click="handleBack">Go back</button>
      <button @click="handleReset">Reset game</button>
    </div>
    <div
      v-if="!endGame"
      class="board-container"
      :class="{ 'not-pointer': userCannotFlipCard }"
    >
      <Card
        v-for="card in cards"
        v-bind="card"
        :key="card.id"
        @handleFlip="flipCard"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { shuffle } from "../../helpers/arrayHelpers";
import { sleep } from "../../helpers/sleepHelper";
import { computerPlayGame } from "../../logic/Skynet";
import { getRandomIndex } from "../../helpers/arrayHelpers";
import { getImages } from "../../services/getImages";
import Card from "./Card.vue";
import Score from "./Score.vue";
export default {
  components: {
    Card,
    Score,
  },
  props: {
    couplesCount: { type: Number },
    gameDificulty: { type: String },
    isPlayAlone: { type: Boolean },

  },
  emits: ["handleReset", 'handleBack'],
  setup(props, context) {
    console.log(props);
    // State
    const cards = ref([]);
    const score = ref();
    const turnComputer = ref(false);
    const shownCards = ref([]);
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
    const handleBack = () =>{
      context.emit('handleBack', props.couplesCount, props.gameDificulty, props.isPlayAlone)
    }

    const createCards = async () => {
      cards.value = [];
      score.value = {
        player: 0,
        cardsPlayer: [],
        computer: 0,
        cardsComputer: [],
      };
      turnComputer.value = false;
      shownCards.value = [];
      endGame.value = false;

      const images = await getImages(props.couplesCount);

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

    const resetFlippedCards = async () => {
      await sleep(2000);
      flippedCards.value.forEach((element) => {
        element.isFlipped = false;
      });
    };

    const checkIfCoupleWasFound = async () => {
      if (flippedCards.value.length < 2) return;

      flippedCards.value.forEach((element) => {
        shownCards.value.push(element);
      });

      const coupleFound =
        flippedCards.value[0].img === flippedCards.value[1].img;
      if (coupleFound) {
        if (!turnComputer.value) {
          score.value.player += 1;
          score.value.cardsPlayer.push(flippedCards.value[0].img);
        } else if (!props.isPlayAlone) {
          score.value.computer += 1;
          score.value.cardsComputer.push(flippedCards.value[0].img);
        }
        flippedCards.value.forEach((element) => {
          element.isHidden = true;
        });
        await resetFlippedCards();
      } else {
        await resetFlippedCards();
        if (!props.isPlayAlone) turnComputer.value = !turnComputer.value;
      }

      if (hiddenCards.value.length === props.couplesCount * 2) {
        endGame.value = true;
        return;
      }
      if (turnComputer.value) {
        await sleep(2000);
        const cardsToFlip = computerPlayGame(
          cards,
          props.gameDificulty,
          shownCards,
          getRandomIndex
        );
        for (let index = 0; index < cardsToFlip.length; index++) {
          flipCard(cardsToFlip[index]);
          await sleep(500);
        }
      }
    };
    if (props.couplesCount > 0) createCards();
    return {
      handleReset,
      handleBack,
      cards,
      createCards,
      flipCard,
      Card,
      score,
      Score,
      turnComputer,
      userCannotFlipCard,
      endGame,
    };
  },
};
</script>

<style>
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
