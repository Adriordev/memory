<template>
  <div v-if="!isVisibleBoard" class="config-game">
    <div v-if="!isRegister" class="register-name">
      <label for="name">User name</label>
      <input id="name" v-model="name" type="text" @focus="errName = ''" />
      <span :class="{ errName: errName }">{{ errName }}</span>

      <button type="submit" @click="RegisterName">Enter</button>
    </div>
    <div v-if="isRegister">
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
      <p>or</p>
      <h3>Join in a game</h3>
      <input v-model="codeGame" type="text" @focus="errCode = ''" />
      <br />
      <span :class="{ errCode: errCode }">{{ errCode }}</span>
      <br />
      <button @click="joinGame">Join</button>
    </div>
  </div>

  <mBoard v-if="isVisibleBoard" :key="keyComponent" v-bind="dataGame" />
</template>
<script>
import { ref, onUnmounted, watchEffect } from "vue";
import  socket  from "../../socket";
import mBoard from "./mBoard.vue";
export default {
  components: {
    mBoard,
  },
  setup() {
    const name = ref("");
    const couplesCount = ref(null);
    const isRegister = ref(false);
    const errName = ref(null);
    const errCouples = ref(null);
    const errCode = ref(null);
    const isVisibleBoard = ref(false);
    const codeGame = ref(null);
    const keyComponent = ref(true);
    const dataGame = ref({
      gameId: null,
      cards: null,
      score: null,
      turn: null,
    });
    watchEffect(() => {
      console.log('dataGame en mConfig: ', dataGame.value);
    });
    //----User's register with socket.io ----
    let session = localStorage.getItem("session");
    if (session) {
      session = JSON.parse(session);
      const sessionId = session.sessionId;
      const userId = session.userId;
      const userName = session.userName;

      socket.auth = { sessionId, userId, userName };
      socket.connect();
    }

    const RegisterName = () => {
      const userName = name.value;
      socket.auth = { userName };
      socket.connect();
    };

    socket.on("session", ({ sessionId, userId, userName }) => {
      socket.auth = { sessionId, userId, userName };
      localStorage.setItem("session", JSON.stringify(socket.auth));
      socket.sessionId = sessionId;
      socket.userId = userId;
      socket.userName = userName;
      name.value = userName;
      isRegister.value = true;
    });

    socket.on("connect_error", (err) => {
      if (err.message === "invalid userName") {
        errName.value = "Invalid userName";
      }
    });

    onUnmounted(() => {
      socket.off("connect_error");
    });

    socket.on("updateGame", (game) => {
      dataGame.value = game;
      isVisibleBoard.value = true;
    });

    const createGame = () => {
      const userId = socket.userId;
      const couples = couplesCount.value;
      if (couples <= 0 || couples === "") {
        errCouples.value = "Enter a valid number please";
        return;
      }
      socket.emit("createGame", {
        userId: userId,
        couples: couples,
      });
    };

    const joinGame = () => {
      const gameId = codeGame.value;
      const userId = socket.userId;
      if (gameId === "") {
        errCode.value = "Code is empty, enter a valid code";
        return;
      }
      socket.emit("joinGame", {
        gameId: gameId,
        userId: userId,
      });
    };

    socket.on("startGame", (game) => {
      //aqui generar un link con el codigo para poder pinchar y acceder al juego
      dataGame.value = game;
      isVisibleBoard.value = true;
    });

    socket.on("connect_error", (err) => {
      if (err.message === "invalid couples") {
        errCouples.value = "Enter a valid number please";
      }
    });

    return {
      name,
      couplesCount,
      RegisterName,
      isRegister,
      errName,
      errCouples,
      errCode,
      isVisibleBoard,
      createGame,
      dataGame,
      joinGame,
      codeGame,
      mBoard,
      keyComponent,
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
