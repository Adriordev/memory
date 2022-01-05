<template>
  <section class="main-container">
    <div class="header">
      <h1>MEMORY GAME</h1>
      <br />
      <h2>{{ sayHello }}</h2>
    </div>
    <ConfigGame :key="key" @trowHandleReset="changeValueKey" />
  </section>
</template>

<script>
import { ref, onMounted } from "vue";
import ConfigGame from "./components/singleplayer/ConfigGame.vue";
import { helloWorld } from "./services/helloWorld";

export default {
  name: "App",
  components: {
    ConfigGame,
  },
  setup() {
    const sayHello = ref(null);
    const key = ref(true);
    onMounted(() => {
      helloWorld(sayHello);
    });

    const changeValueKey = () => {
      key.value = !key.value;
      console.log(key.value);
    };

    return {
      ConfigGame,
      sayHello,
      key,
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
  grid-template-rows: auto auto auto auto;
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
</style>
