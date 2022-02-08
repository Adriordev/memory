<template>
  <div
    class="
      flex flex-auto flex-col
      justify-center
      items-center
      mx-auto
      max-w-screen-md
      m-4
      p-4
      border
    "
  >
    <h2>Welcome to memory's game</h2>
    <h3>Please, select a game mode</h3>

    <button class="btn" @click="selectGameMode(1)">Singleplayer</button>
    <br />
    <button class="btn" @click="selectGameMode(2)">Multiplayer</button>

    <label for="couplesCount">Number of couples</label>
    <br />
    <input
      id="couples"
      v-model="couplesCount"
      class="input-text"
      type="number"
      @focus="errCouples = ''"
    />
    <span class="error" :class="{ 'error-span': errCouples }">{{
      errCouples
    }}</span>
    <div
      v-if="selectedGameMode === 'singlePlayer'"
      id="SINGLEPLAYER"
      class="flex flex-col items-center"
    >
      <h3>Please, select an option</h3>
      <div class="first-step">
        <label for="play-alone"> play alone </label>
        <input
          v-model="singlePlayerMode"
          class="radio-btn"
          type="radio"
          name="singlePlayerMode"
          value="playAlone"
        />

        <label for="player-vs-computer"> player vs computer </label>
        <input
          v-model="singlePlayerMode"
          class="radio-btn"
          type="radio"
          name="singlePlayerMode"
          value="playerVsComputer"
        />
      </div>
      <div v-if="singlePlayerMode === 'playerVsComputer'" class="second-step">
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
      <div v-if="singlePlayerMode">
        <button class="btn" @click="createGame">Create</button>
      </div>
    </div>

    <div v-if="selectedGameMode === 'multiPlayer'" id="MULTIPLAYER">
      <button class="btn" @click="createGame">generate game</button>
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
    const gameMode = ref("");

    const router = useRouter();

    // Computed
    const selectedGameMode = computed(() => gameMode.value);
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
      selectGameMode,
      errCouples,
      createGame,
    };
  },
};
</script>
<style></style>
