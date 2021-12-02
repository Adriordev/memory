<template>
  <div class="config-game" v-if="!isVisibleBoard">
    <label for="couplesCount">Numer of couples</label>
    <input type="number" v-model="couplesCount" />
    <div v-if="!isPlayAlone">
      <label for="normal">Normal</label>
      <input
        type="radio"
        name="gameDificulty"
        value="normal"
        v-model="gameDificulty"
      />
      <label for="hard">Hard</label>
      <input
        type="radio"
        name="gameDificulty"
        value="hard"
        v-model="gameDificulty"
      />
    </div>
    <button @click="createBoard">Create</button>
  </div>
  <Board
    :key="key"
    @handleReset="changeValueKey"
    :couplesCount="couplesCount"
    :gameDificulty="gameDificulty"
    :isPlayAlone="isPlayAlone"
    v-if="isVisibleBoard"
  />
</template>
<script>
import Board from "./Board.vue";
import { ref } from "vue";
export default {
  props: {
    isPlayAlone: { type: Boolean },
  },
  components: {
    Board,
  },
  setup() {
    const couplesCount = ref();
    const gameDificulty = ref("normal");
    const isVisibleBoard = ref(false);
    const key = ref(false);

    const changeValueKey = () => {
      key.value = !key.value;
      couplesCount.value = "";
      isVisibleBoard.value = false;
    };

    const createBoard = () => {
      if (couplesCount.value <= 0) return;
      isVisibleBoard.value = true;
    };

    return {
      Board,
      couplesCount,
      gameDificulty,
      isVisibleBoard,
      changeValueKey,
      key,
      createBoard,
    };
  },
};
</script>
<style>
.config-game {
  grid-area: config-game;
  display: flex;
  flex-flow: column wrap;
}
.config-game > * {
  margin: 0.5rem auto;
  width: 10rem;
}
.config-game button {
}
</style>
