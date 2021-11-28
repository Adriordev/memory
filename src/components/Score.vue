<template>
  <div class="score" v-if="!endGame">
    <div class="player-score">
      <h3>Win player cards: {{ player }}</h3>
    </div>
    <div class="computer-score">
      <h3>Win computer cards: {{ computer }}</h3>
    </div>
  </div>
  <div v-else>
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
    endGame: { type: Boolean },
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
  min-height: 150px;
  margin-bottom: 5px;
}
.player-score,
.computer-score {
  padding: 5px;
}
</style>
