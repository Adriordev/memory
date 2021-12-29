<template>
  <section class="main-container">
    <header>
      <h1>MEMORY GAME</h1>
      <p>{{ sayHello }}</p>
    </header>
    <div v-if="!isVisibleGameSelector" class="select-game">
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
    <ConfigGame v-if="isVisibleGameSelector" :is-play-alone="isPlayAlone" />
  </section>
</template>

<script>
import { onMounted, ref } from "vue";
import ConfigGame from "./components/ConfigGame.vue";
import { helloWorld } from "./services/helloWorld";
export default {
  name: "App",
  components: {
    ConfigGame,
  },
  setup() {
    onMounted(() => {
      helloWorld(sayHello);
    });
    const sayHello = ref(null);
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
      sayHello,
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
