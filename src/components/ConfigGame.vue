<template>
  <div v-if="!isVisibleBoard" class="config-game">
    <label for="couplesCount">Numer of couples</label>
    <input v-model="couplesCount" type="number" />
    <div v-if="!isPlayAlone">
      <label for="easy">Easy</label>
      <input
        v-model="gameDificulty"
        type="radio"
        name="gameDificulty"
        value="easy"
      />
      <label for="normal">Normal</label>
      <input
        v-model="gameDificulty"
        type="radio"
        name="gameDificulty"
        value="normal"
      />
      <label for="hard">Hard</label>
      <input
        v-model="gameDificulty"
        type="radio"
        name="gameDificulty"
        value="hard"
      />
    </div>
    <button @click="createBoard">Create</button>
  </div>
  <Board
    v-if="isVisibleBoard"
    :key="key"
    :couples-count="couplesCount"
    :game-dificulty="gameDificulty"
    :is-play-alone="isPlayAlone"
    @handleReset="changeValueKey"
  />
</template>
<script>
import Board from "./Board.vue";
import { ref } from "vue";
export default {
  components: {
    Board,
  },
  props: {
    isPlayAlone: { type: Boolean },
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
  /* width: 10rem; */
}
</style>
