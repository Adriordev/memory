<template>
  <div
    class="
      flex flex-col
      w-5/6
      m-auto
      gap-2
      justify-between
      p-2
      h-auto
      rounded-lg
      shadow-md
      blurBackground
      md:w-4/5 md:flex-row 
      lg:w-3/4
    "
  >
    <div
      class="
        space-y-4
        p-4
        flex
        flex-col
        justify-center
        items-center
        w-full
        h-80
        bg-white
        rounded-lg
        border border-gray-200
        shadow-md
        md:p-6 md:w-1/2 md:flex
        lg:p-8 lg:w-1/2
      "
    >
      <h3 class="text-xl text-gray-900 font-bold text-center">
        Please, select a game mode
      </h3>

      <button class="btn" @click="selectGameMode(1)">Singleplayer</button>
      <button class="btn" @click="selectGameMode(2)">Multiplayer</button>
    </div>
    <div
      v-if="selectedGameMode"
      class="
        space-y-4
        p-4
        flex
        flex-col
        justify-center
        items-center
        w-full
        h-80
        bg-white
        rounded-lg
        border border-gray-200
        shadow-md
        md:p-6 md:w-1/2 md:flex
        lg:p-8 lg:w-1/2
      "
    >
      <label
        for="couplesCount"
        class="text-xl text-gray-900 font-bold text-center"
        >Number of couples</label
      >
      <input
        id="couples"
        v-model="couplesCount"
        type="number"
        @focus="errCouples = ''"
      />
      <span class="error w-1/2" :class="{ 'error-span': errCouples }">{{
        errCouples
      }}</span>

      <div v-if="selectedGameMode === 'singlePlayer' && !isSecondStep">
        <h3>Please, select an option</h3>
        <div class="first-step">
          <input
            v-model="singlePlayerMode"
            type="radio"
            name="singlePlayerMode"
            value="playAlone"
          />
          <label for="play-alone"> play alone </label>
          <br />
          <input
            v-model="singlePlayerMode"
            type="radio"
            name="singlePlayerMode"
            value="playerVsComputer"
          />
          <label for="player-vs-computer"> player vs computer </label>
        </div>
        <div v-if="singlePlayerMode === 'playerVsComputer'">
          <div class="game-dificulty">
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
        </div>
      </div>

      <button class="btn" @click="createGame">Create</button>
    </div>
  </div>
</template>
<script>
import { computed, ref } from "vue";
import { getGameId } from "../services/games";
import { useRouter } from "vue-router";

export default {
  name: "ConfigGame",
  setup() {
    // State

    const couplesCount = ref(null);
    const errCouples = ref("");
    const singlePlayerMode = ref("");
    const gameDificulty = ref();
    const isSecondStep = ref(false);
    const isFinishStep = ref(false);
    const gameMode = ref("");

    const router = useRouter();

    // Computed

    const selectedGameMode = computed(() => gameMode.value);

    // Functions

    const selectGameMode = (value) => {
      if (value == 1) {
        gameMode.value = "singlePlayer";
      } else if (value == 2) {
        gameMode.value = "multiPlayer";
      }
    };

    const createGame = async () => {
      if (couplesCount.value <= 0 || couplesCount.value === "") {
        errCouples.value = "Enter a valid number please";
        return;
      }
      const gameId = await getGameId(
        couplesCount.value,
        singlePlayerMode.value,
        gameDificulty.value
      );
      router.push({
        path: `/game${gameId}`,
      });
    };

    return {
      gameMode,
      selectedGameMode,
      couplesCount,
      singlePlayerMode,
      gameDificulty,
      isSecondStep,
      isFinishStep,
      selectGameMode,
      errCouples,
      createGame,
    };
  },
};
</script>
<style></style>
