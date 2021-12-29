<template>
  <div :class="[isPlayAlone ? 'score-alone' : 'score']">
    <div class="player-score" :class="{ 'turn-selector': !turnComputer }">
      <h3>Win player cards: {{ player }}</h3>
      <div class="imgs">
        <img v-for="img in cardsPlayer" :key="img" :src="img" alt="" />
      </div>
    </div>
    <div
      v-if="!isPlayAlone"
      class="computer-score"
      :class="{ 'turn-selector': turnComputer }"
    >
      <h3>Win computer cards: {{ computer }}</h3>
      <div class="imgs">
        <img v-for="img in cardsComputer" :key="img" :src="img" alt="" />
      </div>
    </div>
  </div>
  <div v-if="endGame && !isPlayAlone" class="endGame">
    <h2 v-if="player > computer">YOU WIN ({{ player }} - {{ computer }})</h2>
    <h2 v-else-if="player < computer">
      COMPUTER WINS ({{ player }} - {{ computer }})
    </h2>
    <h2 v-else>DRAW</h2>
  </div>
</template>
<script>
export default {
  props: {
    player: { type: Number },
    computer: { type: Number },
    cardsPlayer: { type: Array },
    cardsComputer: { type: Array },
    endGame: { type: Boolean },
    turnComputer: { type: Boolean },
    isPlayAlone: { type: Boolean },
  },
  setup() {
    return {};
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
.score-alone {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  align-items: start;
  justify-content: space-around;
  margin: 2rem;
}
.player-score,
.computer-score {
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
