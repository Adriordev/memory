<template>
  <section class="main-container">
    <div v-if="selectGameMode === null" class="header">
      <h1>MEMORY GAME</h1>
      <br />
      <h2>Welcome to memory's game</h2>
    </div>
    <div v-if="selectGameMode === null" class="select-game">
      <h3>Please, select a game mode</h3>
      <button @click="gameMode(1)">Single player</button>
      <button @click="gameMode(2)">Multi player</button>
    </div>

    <ConfigGame
      v-if="selectGameMode == 1"
      :key="key"
      @trowHandleReset="changeValueKey"
    />
    <MultiplayerConfigGame v-if="selectGameMode === 2" />
  </section>
</template>

<script>
import { ref } from "vue";
import ConfigGame from "./components/singleplayer/ConfigGame.vue";
import MultiplayerConfigGame from "./components/multiplayer/mConfigGame.vue";

export default {
  name: "App",
  components: {
    ConfigGame,
    MultiplayerConfigGame,
  },
  setup() {
    const selectGameMode = ref(null);
    const key = ref(true);
    const gameMode = (value) => {
      if (value === 1) {
        selectGameMode.value = 1;
      } else if (value === 2) {
        selectGameMode.value = 2;
      }
    };

    const changeValueKey = () => {
      key.value = !key.value;
      console.log(key.value);
    };

    return {
      ConfigGame,
      MultiplayerConfigGame,
      selectGameMode,
      key,
      gameMode,
      changeValueKey,
    };
  },
};
</script>

<style>
#app {
  text-align: center;
}
.main-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(3, 1fr));
  grid-template-rows: auto auto auto;
  padding: 10px;
  grid-template-areas:
    "header header header"
    ". select-game ."
    ". config-game ."
    "board board board";
}
.header {
  grid-area: header;
}
.select-game {
  grid-area: select-game;
  display: flex;
  flex-flow: column wrap;
}
.config-game {
  grid-area: config-game;
  display: flex;
  flex-flow: column wrap;
}
.select-game button,
.config-game button {
  margin: 0.5rem auto;
  width: 10rem;
}
.board {
  grid-area: board;
}
</style>
