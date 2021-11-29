<template>
  <h1>MEMORY GAME</h1>
  <Board :key="reset" @handleReset="resetFunction" />
</template>

<script>
import { ref } from "@vue/reactivity";
import Board from "./components/Board.vue";

export default {
  name: "App",
  components: {
    Board,
  },
  setup() {
    const reset = ref(false);
    const resetFunction = () => {
      reset.value = !reset.value;
    };
    return {
      Board,
      resetFunction,
      reset,
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
