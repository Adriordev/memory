<template>
  <div class="config-game">
    <div v-if="!isVisibleGameSelector" class="first-step-config">
      <h3>Please, select an option</h3>

      <label for="play-alone"> play alone </label>

      <button @click="selectGame(true)">start</button>
      <br />
      <label for="player-vs-computer"> player vs computer </label>

      <button @click="selectGame(false)">start</button>
    </div>

    <div
      v-if="!isVisibleBoard && isVisibleGameSelector"
      class="second-step-config"
    >
      <label for="couplesCount">Numer of couples</label>
      <input v-model="couplesCount" type="number" />
      <div v-if="!isPlayAlone" class="game-dificulty">
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
      <button @click="passToAppHandleReset">Back</button>
    </div>
  </div>

  <Board
    v-if="isVisibleBoard"
    :couples-count="couplesCount"
    :game-dificulty="gameDificulty"
    :is-play-alone="isPlayAlone"
    @handleReset="passToAppHandleReset"
    @handleBack="goBack"
  />
</template>
<script>
import Board from "./Board.vue";
import { ref } from "vue";
export default {
  components: {
    Board,
  },
  emits: ["trowHandleReset"],
  setup(props, context) {
    const isPlayAlone = ref();
    const isVisibleGameSelector = ref(false);
    const couplesCount = ref();
    const gameDificulty = ref("easy");
    const isVisibleBoard = ref(false);

    const goBack = (backCouplesCount, backGameDificulty, backIsPlayAlone) => {
      isPlayAlone.value = backIsPlayAlone;
      isVisibleGameSelector.value = true;
      couplesCount.value = backCouplesCount;
      gameDificulty.value = backGameDificulty;
      isVisibleBoard.value = false;
    };

    const selectGame = (val) => {
      isPlayAlone.value = val;
      isVisibleGameSelector.value = true;
    };

    const createBoard = () => {
      if (couplesCount.value <= 0) return;
      isVisibleBoard.value = true;
    };

    const passToAppHandleReset = () => {
      context.emit("trowHandleReset");
    };
    return {
      Board,
      couplesCount,
      gameDificulty,
      isVisibleBoard,
      createBoard,
      isPlayAlone,
      isVisibleGameSelector,
      selectGame,
      goBack,
      passToAppHandleReset,
    };
  },
};
</script>

<style>
.first-step-config,
.second-step-config {
  display: inherit;
  flex-flow: column wrap;
  justify-content: center;
}
.second-step-config input {
  margin: 0.5rem auto;
  width: 10rem;
}
input[type="radio"]{
  width: 1rem
}
</style>
