<template>
  <div class="board">
    <div class="score-container">
      <Score
        :score="score"
        :turn="turn"
        :is-game-over="isGameOver"
        :single-player-mode="singlePlayerMode"
      />
    </div>
    <div
      v-if="!isGameOver"
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
import socket from "../socket";
import Card from "./Card.vue";
import Score from "./Score.vue";
import { computed, onUpdated } from "vue";
import { computerPlayGame } from "../logic/Skynet";
import { getRandomIndex } from "../helpers/arrayHelpers";
import { sleep } from "../helpers/sleepHelper";

export default {
  components: {
    Card,
    Score,
  },
  props: {
    gameId: {
      type: String,
    },
    cards: {
      type: Array,
    },
    score: {
      type: Array,
    },
    turn: {
      type: String,
    },
    isGameOver: {
      type: Boolean,
    },
    singlePlayerMode: {
      type: String,
      default: undefined,
    },
    gameDificulty: {
      type: String,
      default: undefined,
    },
    shownCards: {
      type: Array,
    },
  },
  setup(props) {
    //State
    /* const computerCardId = ref(""); */
    // Computed
    const flippedCards = computed(() => props.cards.filter((c) => c.isFlipped));
    const userCannotFlipCard = computed(() => flippedCards.value.length == 2);

    //Functions

    onUpdated(() => {
      if (props.isGameOver) return;

      if (props.turn === "computer" && !userCannotFlipCard.value) {
        sleep(1000).then(() => {
          let computerCardId = [];
          computerPlayGame(
            computerCardId,
            props.cards,
            props.gameDificulty,
            props.shownCards,
            getRandomIndex
          );
          socket.emit("flipCard", {
            cardId: computerCardId.value,
            gameId: props.gameId,
            userId: "computer",
          });
        });
      }
    });

    const flipCard = (id) => {
      socket.emit("flipCard", {
        cardId: id,
        gameId: props.gameId,
        userId: socket.userId,
      });
    };

    return {
      flipCard,
      Card,
      Score,
      userCannotFlipCard,
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
