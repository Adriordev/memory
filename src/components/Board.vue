<template>
  <div v-if="isWaitingOpponent" class="min-w-full min-h-min p-3">
    <Score
      :score="dataGame.score"
      :turn="dataGame.turn"
      :is-game-over="dataGame.isGameOver"
      :single-player-mode="dataGame.gameMode"
    />

    <div
      v-if="!dataGame.isGameOver"
      class="
        grid grid-cols-reduced
        gap-1
        row-auto
        md:grid-cols-medium md:gap-4
        lg:grid-cols-fluid
      "
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
  <div
    v-else
    class="
      animate-pulse
      m-auto
      box-border
      rounded-lg
      px-5
      py-2.5
      space-y-4
      text-center
      uppercase
      shadow-2xl
      bg-white
    "
  >
    <h2 class="text-5xl font-semibold">Waiting</h2>
    <h3
      class="
        box-border
        rounded-lg
        px-5
        py-2.5
        text-center
        uppercase
        shadow-2xl
        bg-yellow-300
      "
    >
      Share the URL to your opponent
    </h3>
  </div>
</template>

<script>
import { socket } from "../socket";
import Card from "./Card.vue";
import Score from "./Score.vue";
import { computed, ref, onUpdated } from "vue";
import { addUsertoGame } from "./../services/games";
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
      isStarted: false,
      gameMode: "",
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

    const gameSocket = socket(props.id);

    let session = localStorage.getItem("session");
    if (session) {
      session = JSON.parse(session);

      const sessionId = session.sessionId ? session.sessionId : undefined;
      const userId = session.userId ? session.userId : undefined;
      const userName = session.userName;

      gameSocket.auth = { sessionId, userId, userName };

      gameSocket.connect();
    }
    gameSocket.on("session", async ({ sessionId, userId, userName }) => {
      gameSocket.auth = { sessionId, userId, userName };
      localStorage.setItem("session", JSON.stringify(gameSocket.auth));
      gameSocket.sessionId = sessionId;
      gameSocket.userId = userId;
      gameSocket.userName = userName;
      const userSuccesfullyAdded = await addUsertoGame(
        userId,
        userName,
        props.id
      );

      if (userSuccesfullyAdded) {
        gameSocket.emit("joinGame", props.id);
      } else {
        router.push({
          name: "Config",
        });
      }
    });

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
      isWaitingOpponent
    };
  },
};
</script>

<style></style>
