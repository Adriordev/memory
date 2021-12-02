<template>
  <section class="main-container">
    <header>
      <h1>MEMORY GAME</h1>
    </header>
    <div class="select-game" v-if="!isVisibleGameSelector">
      <h2>Welcome to memory game</h2>
      <p>Please, select the game type you want play</p>
      <br />
      <div class="select-buttons">
        <span>
          <label for="play-alone"> play alone </label>
          <br />
          <button @click="selectGame(true)">start</button>
        </span>
        <span>
          <label for="player-vs-computer"> player vs computer </label>
          <br />
          <button @click="selectGame(false)">start</button>
        </span>
      </div>
    </div>
    <ConfigGame :isPlayAlone="isPlayAlone" v-if="isVisibleGameSelector" />
  </section>
</template>

<script>
import { ref } from "@vue/reactivity";
import ConfigGame from "./components/ConfigGame.vue";

export default {
  name: "App",
  components: {
    ConfigGame,
  },
  setup() {
    const isPlayAlone = ref();
    const isVisibleGameSelector = ref(false);
    const selectGame = (val) => {
      isPlayAlone.value = val;
      isVisibleGameSelector.value = true;
    };
    return {
      isPlayAlone,
      isVisibleGameSelector,
      selectGame,
      ConfigGame,
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
  grid-template-rows: 100px auto auto auto;
  padding: 10px;
  grid-template-areas:
    "header header header"
    ". select-game ."
    ". config-game ."
    "board board board";
}
header {
  grid-area: header;
}
.select-game {
  grid-area: select-game;
  display: flex;
  flex-flow: column wrap;
}
.select-buttons {
  display: inherit;
  flex-flow: row;
  justify-content: space-around;
}
.select-buttons button {
  margin: 0.5rem;
  width: 10rem;
}
</style>
