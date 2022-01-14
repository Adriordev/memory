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
      <button @click="generateGame">generate game</button>
      <p>or</p>
      <h3>Join in a game</h3>
      <input v-model="codeGame" type="text" @focus="errCode = ''" />
      <br />
      <span :class="{ errCode: errCode }">{{ errCode }}</span>
      <br />
      <button @click="joinGame">Join</button>
    </div>
  </div>

  <MultiplayerBoard
    v-if="isVisibleBoard"
    :key="keyComponent"
    :data-game="dataGame"
  />
</template>
<script>
import { ref, onUnmounted } from "vue";
import socket from "../../socket";
import MultiplayerBoard from "./mBoard.vue";
import axios from "axios";
export default {
  components: {
    MultiplayerBoard,
  },
  setup() {
    const name = ref("");
    const couplesCount = ref(null);
    const isRegister = ref(false);
    const errName = ref(null);
    const errCouples = ref(null);
    const errCode = ref(null);
    const isVisibleBoard = ref(false);
    const dataGame = ref(null);
    const codeGame = ref(null);
    const keyComponent = ref(true);

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

    //----Functions----

    const generateGame = async () => {
      if (couplesCount.value <= 0 || couplesCount.value === "") {
        errCouples.value = "Enter a valid number please";
        return;
      }
      const data = {
        couples: couplesCount.value,
        userId: socket.userId,
      };
      try {
        const response = await axios.put(
          "http://localhost:3000/api/game",
          data
        );
        isVisibleBoard.value = true;
        dataGame.value = response.data;
      } catch (error) {
        errCouples.value = error;
      }
    };

    const joinGame = async () => {
      if (codeGame.value === "") {
        errCode.value = "Code is empty, enter a valid code";
        return;
      }
      const data = {userId: socket.userId}
      try {
        const response = await axios.put(
          ("http://localhost:3000/api/game/" + codeGame.value), data
        );
        isVisibleBoard.value = true;
        dataGame.value = response.data;
      } catch (error) {
        errCode.value = error.response.data;
      }
    };

    return {
      name,
      couplesCount,
      RegisterName,
      isRegister,
      errName,
      errCouples,
      errCode,
      isVisibleBoard,
      generateGame,
      dataGame,
      joinGame,
      codeGame,
      MultiplayerBoard,
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
