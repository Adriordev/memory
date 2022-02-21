<template>
  <div class="grid grid-cols-2 place-items-stretch gap-2 mb-2 mx-auto">
    <div
      v-for="player in score"
      :key="player.userId"
      class="
        box-border
        rounded-lg
        text-center
        uppercase
        px-5
        py-2.5
        shadow-2xl
        backdrop-filter backdrop-blur
      "
      :class="[turn === player.userId ? 'turn-selector' : '']"
    >
      <h3 class="text-xs md:text-sm text-gray-900 font-bold">
        <span class="font-normal">Name:</span> {{ player.userName }}
      </h3>
      <h3 class="text-xs md:text-sm text-gray-900 font-bold">
        <span class="font-normal">Couples found:</span>
        {{ player.foundCards.length }}
      </h3>
    </div>
  </div>

  <div
    v-show="isGameOver"
    class="
      gameOver
      flex
      w-5/6
      max-h-max
      m-auto
      p-2
      rounded-lg
      shadow-md
      md:w-1/2
      blurBackground
    "
  >
    <div
      class="
        p-4
        w-full
        flex flex-col
        justify-around
        bg-white
        h-80
        rounded-lg
        border border-gray-200
        shadow-md
        text-center
        md:p-6
        lg:p-8
      "
    >
      <div>
        <p
          v-if="isPlayAlone"
          class="
            text-4xl text-gray-900 text-center
            font-bold
            rounded-lg
            px-5
            py-2.5
            uppercase
          "
        >
          WELL DONE!
        </p>
        <p
          v-else
          class="
            text-4xl text-gray-900 text-center
            font-bold
            rounded-lg
            px-5
            py-2.5
            uppercase
          "
        >
          {{ winPlayerName }}
        </p>
      </div>
      <div>
        <button class="btn mx-auto" @click="backToConfig">home</button>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
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
    const router = useRouter();
    //Computed
    const isPlayAlone = computed(() => props.singlePlayerMode === "playAlone");
    const isWinPlayer = computed(() => props.isGameOver && !isPlayAlone.value);
    const winPlayerName = computed(() =>
      isWinPlayer.value
        ? props.score[0].foundCards.length === props.score[1].foundCards.length
          ? "game in draw"
          : props.score[0].foundCards.length > props.score[1].foundCards.length
          ? props.score[0].userName + ' wins!'
          : props.score[1].userName + ' wins!'
        : ""
    );
    const backToConfig = () => {
      router.push({
        path: "/config",
      });
    };

    return {
      isTurnActive,
      isPlayAlone,
      winPlayerName,
      backToConfig,
    };
  },
};
</script>
<style>
.gameOver {
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
    transform: scale(0.2);
  }
  40% {
    opacity: 0.4;
    transform: scale(0.4);
  }
  60% {
    opacity: 0.6;
    transform: scale(0.6);
  }
  80% {
    opacity: 0.8;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
