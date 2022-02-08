<template>
  <div  v-if="isWaitingOpponent" class="board">
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
  <div v-else>
    <h1>Waiting Opponent</h1>
  </div>
</template>

<script>
import { socket } from "../socket";
import Card from "./Card.vue";
import Score from "./Score.vue";
import { computed, ref, onUpdated } from "vue";
import axios from "axios";
import { computerPlayGame } from "../logic/Skynet";
import { getRandomIndex } from "../helpers/arrayHelpers";
import { sleep } from "../helpers/sleepHelper";
import { useRouter } from "vue-router";

export default {
  name: "Board",
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

    const router = useRouter();

    // Computed
    const flippedCards = computed(() =>
      dataGame.value.cards.filter((c) => c.isFlipped)
    );
    const userCannotFlipCard = computed(() => flippedCards.value.length == 2);
    const isWaitingOpponent = computed(() => dataGame.value.isStarted);
    //Functions

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

          gameSocket.emit("flipCard", {
            cardId: computerCardId.value,
            gameId: dataGame.value.gameId,
            userId: "computer",
          });
        });
      }
    });
    
    const gameSocket = socket(props.id)
    
    let session = localStorage.getItem("session");
    if (session) {
      session = JSON.parse(session);

      const sessionId = session.sessionId ? session.sessionId : undefined;
      const userId = session.userId ? session.userId : undefined;
      const userName = session.userName;

      gameSocket.auth = { sessionId, userId, userName };

      gameSocket.connect();
    }
    gameSocket.on("session", ({ sessionId, userId, userName }) => {
      console.log('vuelvo');
      gameSocket.auth = { sessionId, userId, userName };
      localStorage.setItem("session", JSON.stringify(gameSocket.auth));
      gameSocket.sessionId = sessionId;
      gameSocket.userId = userId;
      gameSocket.userName = userName;
      addUsertoGame(userId, userName);
    });

    const addUsertoGame = async (userId, userName) => {
      console.log("entro", userId, userName);
      try {
        const response = await axios.put(
          `http://localhost:3000/api/game${props.id}`,
          { userId: userId, userName: userName }
        );
        const gameId = response.data;
        gameSocket.emit("joinGame", gameId);
      } catch (error) {
        if (error.response) {
          alert(error.response.data.error);
          router.push({
            name: "Config",
          });
        }
      }
    };
    gameSocket.on("startGame", (game) => {
      dataGame.value = game;
    });

    gameSocket.on("updateGame", (game) => {
      sleep(2000).then(() => {
        dataGame.value = game;
      });
    });

    gameSocket.on("updateFlippedCard", (game) => {
      dataGame.value = game;
    });

    gameSocket.on("resetFlippedCards", (cards) => {
      cards.forEach((element) => {
        sleep(2000).then(() => {
          element.isFlipped = false;
        });
      });
    });

    /* socket.on("catch_error", ({ err }) => {
      if (err === "invalid couples") {
        errCouples.value = "Enter a valid number please";
      }
    }); */

    const flipCard = (id) => {
      gameSocket.emit("flipCard", {
        cardId: id,
        gameId: dataGame.value.gameId,
        userId: gameSocket.userId,
      });
    };

    return {
      dataGame,
      flipCard,
      Card,
      Score,
      userCannotFlipCard,
      isWaitingOpponent,
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
