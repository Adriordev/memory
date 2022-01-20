<template>
  <div class="board">
    <!-- <div v-if="score" class="score-container">
      <Score v-bind="score" :end-game="endGame" />
      <button @click="handleReset">Reset game</button>
    </div> -->
    <div class="board-container">
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
import Score from "../singleplayer/Score.vue";
import { watchEffect } from "@vue/runtime-core";
export default {
  components: {
    mCard,
    /* Score, */
  },
  props: {
    gameId: {
      type: String,
    },
    cards: {
      type: Array,
    },
    score: {
      type: Object,
    },
    turn: {
      type: String,
    },
  },
  setup(props) {
    watchEffect(() => {
      console.log("dataGame en props: ", props);
      console.log("comprobacion de turno: ", props.turn, socket.userId);
      console.log('Scores: ', props.score);
    });
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
      Score,
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
