<template>
  <div class="board">
    <h1>Board</h1>
    <div class="score-container">
      <Score
        :score="dataGame.score"
        :turn="dataGame.turn"
        :is-game-over="dataGame.isGameOver"
        :single-player-mode="dataGame.singlePlayerMode"
      />
    </div>
    <div
      v-if="!dataGame.isGameOver"
      class="board-container"
      :class="{ 'not-pointer': userCannotFlipCard }"
    >
      <Card
        v-for="card in dataGame.cards"
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
import { computed, ref, onBeforeMount, onUpdated } from "vue";
import axios from "axios";
import { computerPlayGame } from "../logic/Skynet";
import { getRandomIndex } from "../helpers/arrayHelpers";
import { sleep } from "../helpers/sleepHelper";

export default {
  components: {
    Card,
    Score,
  },
  props: {
    id: {
      type: String,
    },
  },
  setup(props) {
    //State
    const dataGame = ref({
      gameId: "",
      cards: [],
      score: [],
      turn: "",
      isGameOver: false,
      singlePlayerMode: "",
      gameDificulty: "",
      shownCards: [],
    });

    // Computed
    const flippedCards = computed(() =>
      dataGame.value.cards.filter((c) => c.isFlipped)
    );
    const userCannotFlipCard = computed(() => flippedCards.value.length == 2);

    //Functions
    onBeforeMount(async () => {
      const response = await axios.get(
        `http://localhost:3000/api/game${props.id}`
      );
      const game = response.data;
      socket.emit("joinGameRoom", game);
      dataGame.value = game;
    });

    onUpdated(() => {
      if (dataGame.value.isGameOver) return;

      if (dataGame.value.turn === "computer" && !userCannotFlipCard.value) {
        sleep(1000).then(() => {
          let computerCardId = [];
          computerPlayGame(
            computerCardId,
            dataGame.value.cards,
            dataGame.value.gameDificulty,
            dataGame.value.shownCards,
            getRandomIndex
          );

          socket.emit("flipCard", {
            cardId: computerCardId.value,
            gameId: dataGame.value.gameId,
            userId: "computer",
          });
        });
      }
    });

    socket.on("updateGame", (game) => {
      console.log("entra");
      sleep(2000).then(() => {
        dataGame.value = game;
      });
    });

    socket.on("updateFlippedCard", (game) => {
      console.log("update: ", game.cards);
      dataGame.value = game;
    });

    socket.on("resetFlippedCards", (cards) => {
      cards.forEach((element) => {
        sleep(2000).then(() => {
          element.isFlipped = false;
        });
      });
    });

    const flipCard = (id) => {
      socket.emit("flipCard", {
        cardId: id,
        gameId: dataGame.value.gameId,
        userId: socket.userId,
      });
    };

    return {
      dataGame,
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
