<template>
  {{ gameMode }} - {{ name }}
  <div v-if="!isVisibleBoard" class="config-game">
    <!-- si por props mando una variable que en funcion de su valor 
          muestre la parte de configuracion de singleplayer o multiplayer
          con el nombre previamente introducido.
       -->
    <div v-if="gameMode === 'singlePlayer'" id="SINGLEPLAYER">
      <h3>Please, select an option</h3>
      <div class="first-step">
        <label for="play-alone"> play alone </label>
        <input
          v-model="singlePlayerMode"
          type="radio"
          name="singlePlayerMode"
          value="playAlone"
        />

        <label for="player-vs-computer"> player vs computer </label>
        <input
          v-model="singlePlayerMode"
          type="radio"
          name="singlePlayerMode"
          value="playerVsComputer"
        />
      </div>
      <div class="second-step">
        <label for="couplesCount">Numer of couples</label>
        <input v-model="couplesCount" type="number" />
        <div class="game-dificulty">
          <label for="easy">Easy</label>
          <input
            v-model="gameDificulty"
            type="radio"
            name="gameDificulty"
            value="easy"
          />
          <label for="normal">Normal</label>
          <input
            v-model="gameDificulty"
            type="radio"
            name="gameDificulty"
            value="normal"
          />
          <label for="hard">Hard</label>
          <input
            v-model="gameDificulty"
            type="radio"
            name="gameDificulty"
            value="hard"
          />
        </div>
        <button @click="createGame">Create</button>
        <button @click="passToAppHandleReset">Back</button>
      </div>
    </div>

    <div v-if="gameMode === 'multiPlayer'" id="MULTIPLAYER">
      <h2>Welcome {{ name }}</h2>
      <h3>Generate game</h3>
      <label for="couplesCount">Number of couples</label>
      <br />
      <input
        id="couples"
        v-model="couplesCount"
        type="number"
        @focus="errCouples = ''"
      />
      <br />
      <span :class="{ errCouples: errCouples }">{{ errCouples }}</span>
      <br />
      <button @click="createGame">generate game</button>
      <span v-if="shareCodeGame">
        <p>Share to play: {{ shareCodeGame }}</p>
      </span>
      <p>or</p>
      <h3>Join in a game</h3>
      <input v-model="codeGame" type="text" @focus="errCode = ''" />
      <br />
      <span :class="{ errCode: errCode }">{{ errCode }}</span>
      <br />
      <button @click="joinGame">Join</button>
    </div>
  </div>
  <div v-show="isVisibleBoard">
    <Board
      v-bind="dataGame"
      :single-player-mode="singlePlayerMode"
      :game-dificulty="gameDificulty"
    />
  </div>
</template>
<script>
import { ref } from "vue";
import socket from "../socket";
import Board from "./Board.vue";
import { sleep } from "../helpers/sleepHelper";
import axios from "axios";

export default {
  components: {
    Board,
  },
  props: {
    gameMode: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  setup() {
    const couplesCount = ref(null);
    const singlePlayerMode = ref();
    const gameDificulty = ref();

    const errCouples = ref("");
    const shareCodeGame = ref(null);
    const errCode = ref("");
    const isVisibleBoard = ref(false);
    const codeGame = ref(null);

    const dataGame = ref({
      gameId: "",
      cards: [],
      score: [],
      turn: null,
      showCards: [],
    });

    //----SINGLEPLAYER

    //----MULTIPLAYER

    socket.on("updateGame", (game) => {
      sleep(2000).then(() => {
        dataGame.value = game;
      });
      isVisibleBoard.value = true;
    });

    socket.on("updateFlippedCard", (game) => {
      dataGame.value = game;
    });

    const createGame = async () => {
      if (couplesCount.value <= 0 || couplesCount.value === "") {
        errCouples.value = "Enter a valid number please";
        return;
      }
      const userId = socket.userId;
      const userName = socket.userName;

      await axios.post("http://localhost:3000/api/game", {
        userId: userId,
        userName: userName,
        couplesCount: couplesCount.value,
        singlePlayerMode: singlePlayerMode.value,
      });
    };

    const joinGame = () => {
      const gameId = codeGame.value;
      const userId = socket.userId;
      const userName = socket.userName;
      if (!gameId) {
        errCode.value = "Code is empty, enter a valid code";
        return;
      }
      socket.emit("joinGame", {
        gameId: gameId,
        userId: userId,
        userName: userName,
      });
    };

    socket.on("catch_error", ({ err }) => {
      if (err === "invalid couples") {
        errCouples.value = "Enter a valid number please";
      }
      if (err === "invalid code") {
        errCode.value = "Game not found, try again";
      }
    });

    return {
      couplesCount,
      singlePlayerMode,
      gameDificulty,
      errCouples,
      shareCodeGame,
      errCode,
      isVisibleBoard,
      createGame,
      dataGame,
      joinGame,
      codeGame,
      Board,
    };
  },
};
</script>
<style>
.errName,
.errCouples,
.errCode {
  color: red;
}
</style>
