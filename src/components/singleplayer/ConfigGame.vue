<template>
  <div v-if="!isVisibleGameSelector" class="select-game">
    <br />
    <h3>Please, select an option</h3>
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

  <div v-if="!isVisibleBoard && isVisibleGameSelector" class="config-game">
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
    <button @click="passToAppHandleReset">Back</button>
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
  emits:['trowHandleReset'],
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

    const passToAppHandleReset = () =>{
      context.emit('trowHandleReset')
    }
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
      passToAppHandleReset
    };
  },
};
</script>
<style>
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
.config-game {
  grid-area: config-game;
  display: flex;
  flex-flow: column wrap;
}
.config-game > * {
  margin: 0.5rem auto;
}
.config-game button {
  width: 10rem;
}
</style>
