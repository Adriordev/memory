<template>
  <div class="board">
    <div class="score-container">
      <mScore :score="score" :turn="turn" :is-end-game="isGameOver" />
    </div>
    <div
      v-if="!isGameOver"
      class="board-container"
      :class="{ 'not-pointer': userCannotFlipCard }"
    >
      <mCard
        v-for="card in cards"
        v-bind="card"
        :key="card.id"
        @handleFlip="flipCard"
      />
    </div>
    <div v-if="isGameOver" class="gameOver">
      <h2 v-if="countFoundCardsPlayer0 > countFoundCardsPlayer1">
        {{ score[0].userName }} es el ganador!
      </h2>
      <h2 v-else>{{ score[1].userName }} es el ganador!</h2>
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
    isGameOver: {
      type: Boolean,
    },
  },
  setup(props) {
    // Computed

    const flippedCards = computed(() => props.cards.filter((c) => c.isFlipped));
    const userCannotFlipCard = computed(() => flippedCards.value.length == 2);
    const countFoundCardsPlayer0 = computed(
      () => props.score[0].foundCards.length
    );
    const countFoundCardsPlayer1 = computed(
      () => props.score[1].foundCards.length
    );

    //Functions

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
      countFoundCardsPlayer0,
      countFoundCardsPlayer1,
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
.gameOver {
  border: 1px solid red;
  border-radius: 25px;
  background-color: lightcoral;
  font-size: 22px;
  text-transform: uppercase;
  color: white;
  height: 300px;
  width: 50%;
  margin: 0 auto;
  margin-top: 12rem;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  20% {
    opacity: 0.20;
    transform: scale(0.20) rotate(72deg);
  }
  40% {
    opacity: 0.40;
    transform: scale(0.40) rotate(144deg); 
  }
  60% {
    opacity: 0.60;
    transform: scale(0.60) rotate(216deg);
  }
  80% {
    opacity: 0.80;
    transform: scale(0.80) rotate(288deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(360deg);
  }
}
</style>
