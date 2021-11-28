<template>
  <h1>MEMORY GAME</h1>
  <Board />
</template>

<script>
import Board from "./components/Board.vue";

export default {
  name: "App",
  components: {
    Board,
  },
  setup() {
    return {
      Board,
    };
  },
};
</script>

<style>
html {
  text-align: center;
  margin: 0 auto;
}
</style>
