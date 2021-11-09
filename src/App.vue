<template>
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
