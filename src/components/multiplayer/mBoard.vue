<template>
  <div class="board">
    <!-- verificar que salga el codigo solo si es el creador del juego -->
    <h3>CODE TO SHARE: {{dataGame.gameId}}</h3>
    <div v-if="score" class="score-container">
      <Score v-bind="score" :end-game="endGame" />
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
import { ref, computed, onBeforeMount } from "vue";
import { sleep } from "../../helpers/sleepHelper";
import Card from "../singleplayer/Card.vue";
import Score from "../singleplayer/Score.vue";
export default {
  components: {
    Card,
    Score,
  },
  props: {
    dataGame: { type: Object },
  },
  emits: ["handleReset"],
  setup(props, context) {
    console.log(props.dataGame.score[0].userId);
    // State
    const cards = ref([]);
    const score = ref([]);
    const shownCards = ref([]);
    const endGame = ref(false);

    // Computed

    const flippedCards = computed(() => cards.value.filter((c) => c.isFlipped));
    const userCannotFlipCard = computed(() => flippedCards.value.length == 2);
    const hiddenCards = computed(() => cards.value.filter((c) => c.isHidden));

    // Functions
    onBeforeMount(() => {
      cards.value = props.dataGame.cards
      score.value = props.dataGame.score
    })
    const handleReset = () => {
      context.emit("handleReset");
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
        /* if (!turnComputer.value) {
          score.value.player += 1;
          score.value.cardsPlayer.push(flippedCards.value[0].img);
        } else if (!props.isPlayAlone) {
          score.value.computer += 1;
          score.value.cardsComputer.push(flippedCards.value[0].img);
        } */
        flippedCards.value.forEach((element) => {
          element.isHidden = true;
        });
        await resetFlippedCards();
      } else {
        await resetFlippedCards();
        /* if (!props.isPlayAlone) turnComputer.value = !turnComputer.value; */
      }

      if (hiddenCards.value.length === props.couplesCount * 2) {
        endGame.value = true;
        return;
      }
    };

    return {
      handleReset,
      cards,
      flipCard,
      Card,
      score,
      Score,
      userCannotFlipCard,
      endGame,
    };
  },
};
</script>

<style>
.board {
  grid-area: board;
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
