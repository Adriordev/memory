<template>
  <section class="main-container">
    <div class="header">
      <h1>MEMORY GAME</h1>
      <br />
      <h2>
        Welcome <span v-if="isRegister">{{ name }}</span> to memory's game
      </h2>
    </div>
    <div v-if="!isRegister" class="register-name">
      <label for="name">User name</label>
      <input id="name" v-model="name" type="text" @focus="errName = ''" />
      <span :class="{ errName: errName }">{{ errName }}</span>

      <button type="submit" @click="RegisterName">Enter</button>
    </div>
    <div class="select-game">
      <h3>Please, select a game mode</h3>
      <button @click="selectGameMode(1)">Single player</button>
      <button @click="selectGameMode(2)">Multi player</button>
    </div>

    <ConfigGame v-if="gameMode" :game-mode="gameMode" :name="name" />
  </section>
</template>

<script>
import { ref, onUnmounted } from "vue";

import ConfigGame from "./ConfigGame.vue";
import socket from "../socket";
export default {
  name: "Register",
  components: {
    ConfigGame,
  },
  setup() {
    const name = ref(null);
    const isRegister = ref(false);
    const errName = ref("");
    const errCouples = ref("");
    const gameMode = ref("");

    const selectGameMode = (value) => {
      if (value == 1) {
        gameMode.value = "singlePlayer";
      } else if (value == 2) {
        gameMode.value = "multiPlayer";
      }
    };
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
      if (!name.value) {
        errName.value = "Enter a valid name please";
        return;
      }
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
        errName.value = "Enter a valid name please";
      }
    });

    onUnmounted(() => {
      socket.off("connect_error");
    });

    return {
      ConfigGame,
      selectGameMode,
      gameMode,
      name,
      RegisterName,
      isRegister,
      errName,
      errCouples,
    };
  },
};
</script>

<style>
#app {
  text-align: center;
}
.errName {
  color: red;
}
</style>
