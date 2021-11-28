<template>
  <div class="score" v-if="!endGame">
    <div class="player-score">
      <h3>Win player cards: {{ player }}</h3>
      <div class="imgs">
        <img :src="img" alt="" v-for="img in cardsPlayer" :key="img" />
      </div>
    </div>
    <div class="computer-score">
      <h3>Win computer cards: {{ computer }}</h3>
      <div class="imgs">
        <img :src="img" alt="" v-for="img in cardsComputer" :key="img" />
      </div>
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
    cardsPlayer: { type: Array },
    cardsComputer: { type: Array },
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
.imgs {
  margin: auto;
  display: flex;
  justify-content: center;
  max-width: 75%;
  flex-wrap: wrap;
  gap: 1px 1px;
}
.imgs > img {
  width: 100px;
  border-radius: 4%;
}
</style>
