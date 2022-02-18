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
        flex flex-col
        justify-center
        items-center
        w-full
        h-80
        bg-white
        rounded-lg
        border border-gray-200
        shadow-md
        md:p-6 md:w-1/2 md:flex-1
        lg:p-8 lg:w-1/2
      "
    >
      <h3 class="text-xl text-gray-900 font-bold text-center">
        Select a game mode
      </h3>
      <button class="btn" @click="selectGameMode(1)">Practice</button>
      <button class="btn" @click="selectGameMode(2)">Singleplayer</button>
      <button class="btn" @click="selectGameMode(3)">Multiplayer</button>
    </div>
    <div
      class="
        space-y-4
        p-4
        flex flex-col
        justify-center
        items-center
        w-full
        h-80
        bg-white
        rounded-lg
        border border-gray-200
        shadow-md
        md:p-6 md:w-1/2 md:flex-1
        lg:p-8 lg:w-1/2
      "
    >
      <div
        v-if="selectedGameMode === 'practice'"
        class="flex flex-col justify-between min-h-full"
      >
        <h3 class="text-xl text-gray-900 font-semibold text-center pt-2">
          Play alone <br />
          and <br />
          improve your skills
        </h3>
        <div class="flex h-1/2 items-center gap-2">
          <button class="btn border-2 w-20 h-20" @click="createPreGame(6)">
            4x3
          </button>

          <button class="btn border-2 w-20 h-20" @click="createPreGame(10)">
            5x4
          </button>

          <button class="btn border-2 w-20 h-20" @click="createPreGame(14)">
            7x4
          </button>
        </div>
      </div>
      <div
        v-if="selectedGameMode === 'singleplayer'"
        class="
          flex flex-col
          justify-start
          items-center
          min-h-full
          space-y-2
          min-w-full
        "
      >
        <div class="gameMode bg-yellow-300 text-center rounded-lg p-2.5">
          <label for="normal"> normal </label>
          <input
            v-model="typeGameMode"
            type="radio"
            name="typeGameMode"
            value="normal"
          />
          <input
            v-model="typeGameMode"
            type="radio"
            name="typeGameMode"
            value="custom"
          />
          <label for="custom"> custom </label>
        </div>
        <div class="flex flex-col space-y-2 w-full h-full text-center">
          <div class="gameDificulty space-y-2">
            <h3 class="text-md text-gray-900 font-semibold text-center">
              Computer dificulty
            </h3>
            <div>
              <input
                v-model="gameDificulty"
                type="radio"
                name="gameDificulty"
                value="easy"
              />
              <label for="easy">Easy</label>
              <input
                v-model="gameDificulty"
                type="radio"
                name="gameDificulty"
                value="normal"
              />
              <label for="normal">Normal</label>
              <input
                v-model="gameDificulty"
                type="radio"
                name="gameDificulty"
                value="hard"
              />
              <label for="hard">Hard</label>
            </div>
          </div>
          <div
            v-if="typeGameMode === 'normal'"
            class="flex flex-1 justify-center items-center gap-2"
          >
            <button class="btn border-2 w-20 h-20" @click="createPreGame(6)">
              4x3
            </button>
            <button class="btn border-2 w-20 h-20" @click="createPreGame(10)">
              5x4
            </button>
            <button class="btn border-2 w-20 h-20" @click="createPreGame(14)">
              7x4
            </button>
          </div>

          <div
            v-if="typeGameMode === 'custom'"
            class="flex flex-1 justify-center"
          >
            <div class="flex flex-col justify-center items-center">
              <label
                for="couplesCount"
                class="text-md text-gray-900 font-semibold text-center"
                >Number of couples</label
              >
              <input
                id="couples"
                v-model="couplesCount"
                type="number"
                @focus="errCouples = ''"
              />
              <span class="error" :class="{ 'error-span': errCouples }">{{
                errCouples
              }}</span>
              <button class="btn" @click="createGame">Create</button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="selectedGameMode === 'multiplayer'"
        class="flex flex-col justify-start items-center"
      >
        <label
          for="couplesCount"
          class="text-md text-gray-900 font-semibold text-center"
          >Number of couples</label
        >
        <input
          id="couples"
          v-model="couplesCount"
          type="number"
          @focus="errCouples = ''"
        />
        <span class="error" :class="{ 'error-span': errCouples }">{{
          errCouples
        }}</span>
        <button class="btn" @click="createGame">Create</button>
      </div>
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
    const gameDificulty = ref("easy");
    const gameMode = ref("");
    const typeGameMode = ref("normal");
    const router = useRouter();

    // Computed

    const selectedGameMode = computed(() => gameMode.value);

    // Functions

    const selectGameMode = (value) => {
      if (value == 1) {
        gameMode.value = "practice";
      } else if (value == 2) {
        gameMode.value = "singleplayer";
      } else if (value == 3) {
        gameMode.value = "multiplayer";
      }
    };

    const createPreGame = async (grid) => {
      const gameId = await getGameId(grid, gameMode.value, gameDificulty.value);
      router.push({
        path: `/game/${gameId}`,
      });
    };

    const createGame = async () => {
      if (couplesCount.value <= 0 || couplesCount.value === "") {
        console.log("entro");
        errCouples.value = "Enter a valid number please";
        return;
      }
      const gameId = await getGameId(
        couplesCount.value,
        gameMode.value,
        gameDificulty.value
      );
      router.push({
        path: `/game/${gameId}`,
      });
    };

    return {
      gameMode,
      selectedGameMode,
      typeGameMode,
      couplesCount,
      gameDificulty,
      selectGameMode,
      errCouples,
      createGame,
      createPreGame,
    };
  },
};
</script>
<style></style>
