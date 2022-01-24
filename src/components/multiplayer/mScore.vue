<template>
  <div class="score">
    <div
      class="player-score"
      :class="[turn === score[0].userId ? 'turn-selector' : '']"
    >
      <h3>{{score[0].userName}}</h3>
      <div class="imgs">
        <img v-for="img in score[0].foundCards" :key="img" :src="img" alt="" />
      </div>
    </div>
    <div
      class="player-score"
      :class="[turn === score[1].userId ? 'turn-selector' : '']"
    >
      <h3>{{score[1].userName}}</h3>
      <div class="imgs">
        <img v-for="img in score[1].foundCards" :key="img" :src="img" alt="" />
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from "@vue/runtime-core";
export default {
  props: {
    score: {
      type: Array,
    },
    turn: {
      type: String,
    },
  },
  setup() {
    // State

    const isTurnActive = ref(null);

    return {
      isTurnActive,
    };
  },
};
</script>
<style>
.score {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50%, 1fr));
  align-items: start;
  justify-content: space-around;
  margin: 2rem;
}
.player-score {
  padding: 5px;
}
.turn-selector {
  box-sizing: border-box;
  border: 2px solid rgb(154, 205, 50);
  background-color: rgba(154, 205, 50, 0.5);
}
.imgs {
  margin: auto;
  display: flex;
  justify-content: center;
  max-width: 75%;
  min-height: 67px;
  flex-wrap: wrap;
  gap: 1px 1px;
}
.imgs > img {
  width: 100px;
  border-radius: 4%;
}
</style>
