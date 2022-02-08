<template>
  <div class="score">
    <div
      v-for="player in score"
      :key="player.userId"
      class="player-score"
      :class="[turn === player.userId ? 'turn-selector' : '']"
    >
      <h3>{{ player.userName }}</h3>
      <div class="imgs">
        <img v-for="img in player.foundCards" :key="img" :src="img" alt="" />
      </div>
    </div>
  </div>
  <div v-show="isGameOver">
    <div v-if="isPlayAlone" class="gameOver">
      <p>WELL DONE!</p>
    </div>
    <div v-else class="gameOver">
      <p>{{ winPlayerName }} WINS!</p>
    </div>
  </div>
</template>
<script>
import { ref, computed, watchEffect } from "vue";
export default {
  props: {
    score: {
      type: Array,
    },
    turn: {
      type: String,
    },
    isGameOver: {
      type: Boolean,
    },
    singlePlayerMode: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    // State
    const isTurnActive = ref(null);
    watchEffect(() => {
      console.log("props en score: ", props);
    });
    //Computed
    const isPlayAlone = computed(() => props.singlePlayerMode === "playAlone");
    const isWinPlayer = computed(() => props.isGameOver && !isPlayAlone.value);
    const winPlayerName = computed(() =>
      isWinPlayer.value
        ? props.score[0].foundCards.length > props.score[1].foundCards.length
          ? props.score[0].userName
          : props.score[1].userName
        : ""
    );

    return {
      isTurnActive,
      isPlayAlone,
      winPlayerName,
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
img {
  min-width: 50px !important;
  max-height: 50px !important;
  border-radius: 4%;
}
.gameOver {
  border: 1px solid red;
  border-radius: 25px;
  background-color: lightcoral;
  font-size: 22px;
  text-transform: uppercase;
  color: white;
  height: 300px;
  width: 50%;
  margin: 0 auto;

  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  20% {
    opacity: 0.2;
    transform: scale(0.2) rotate(72deg);
  }
  40% {
    opacity: 0.4;
    transform: scale(0.4) rotate(144deg);
  }
  60% {
    opacity: 0.6;
    transform: scale(0.6) rotate(216deg);
  }
  80% {
    opacity: 0.8;
    transform: scale(0.8) rotate(288deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(360deg);
  }
}
</style>
