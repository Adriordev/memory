<template>
  <h1>MEMORY GAME</h1>
  <Board :key="key" @handleReset="changeValueKey" />
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
    const key = ref(false);
    const changeValueKey = () => {
      key.value = !key.value;
    };
    return {
      Board,
      changeValueKey,
      key,
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
