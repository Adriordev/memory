<template>
  <div class="board">
    <div class="score-container">
      <mScore :score="score" :turn="turn" />
    </div>
    <div class="board-container" :class="{ 'not-pointer': userCannotFlipCard }">
      <mCard
        v-for="card in cards"
        v-bind="card"
        :key="card.id"
        @handleFlip="flipCard"
      />
    </div>
  </div>
</template>

<script>
import socket from "../../socket";
import mCard from "./mCard.vue";
import mScore from "../multiplayer/mScore.vue";
import { computed } from "@vue/runtime-core";
export default {
  components: {
    mCard,
    mScore,
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
  },
  setup(props) {

    // Computed

    const flippedCards = computed(() => props.cards.filter((c) => c.isFlipped));
    const userCannotFlipCard = computed(() => flippedCards.value.length == 2);

    const flipCard = (id) => {
      console.log(socket.userId);
      socket.emit("flipCard", {
        cardId: id,
        gameId: props.gameId,
        userId: socket.userId,
      });
    };

    return {
      flipCard,
      mCard,
      mScore,
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
