<template>
  <div class="generate-board">
    <h3>Board</h3>
    <label for="couplesCount">Numero de parejas: </label>
    <input type="number" v-model="couplesCount" @keyup.enter="createCards" />
    <button @click="createCards">crear</button>
  </div>
  <div v-if="isScoreVisible">
    <h3>Cartas ganadas jugador: {{ score.human }}</h3>
    <h3>Cartas ganadas maquina: {{ score.computer }}</h3>
  </div>

  <div class="board-container" :class="{ 'not-pointer': userCannotFlipCard }">
    <Card
      v-bind="card"
      @handleFlip="flipCard"
      v-for="card in cards"
      :key="card.id"
    />
  </div>
</template>

<script>
import { ref, computed } from "vue";
import Card from "./Card.vue";
import axios from "axios";
export default {
  components: {
    Card,
  },

  setup() {
    // State
    const couplesCount = ref();
    const cards = ref([]);
    //depende del modo de juego que queramos crear, si es por rondas o por juegos independientes
    const score = ref({ human: 0, computer: 0 });
    const turnComputer = ref(false);
    const isScoreVisible = ref(false);

    // Computed
    const flippedCards = computed(() => cards.value.filter((c) => c.isFlipped));
    const userCannotFlipCard = computed(
      () => turnComputer.value || flippedCards.value.length == 2
    );

    //Functions
    const createCards = async () => {
      cards.value = [];
      score.value = { human: 0, computer: 0 };
      turnComputer.value = false;
      isScoreVisible.value = true;

      const response = await axios.get(
        `https://picsum.photos/v2/list?limit=${couplesCount.value}`
      );
      const images = response.data.map((img) => img.download_url);

      for (let index = 0; index < images.length; index++) {
        const cardA = {
          id: `${index}A`,
          text: index,
          isFlipped: false,
          isHidden: false,
          img: images[index],
        };
        cards.value.push(cardA);

        const cardB = {
          id: `${index}B`,
          text: index,
          isFlipped: false,
          isHidden: false,
          img: images[index],
        };
        cards.value.push(cardB);
      }
      shuffle(cards.value);
    };

    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    const flipCard = async (id) => {
      const selectCardtoFlip = cards.value.find((c) => c.id === id);
      selectCardtoFlip.isFlipped = true;

      await checkIfCoupleWasFound();
    };

    const checkIfCoupleWasFound = async () => {
      if (flippedCards.value.length < 2) return;

      const coupleFound =
        flippedCards.value[0].img === flippedCards.value[1].img;
      if (coupleFound) {
        if (turnComputer.value) {
          score.value.computer += 1;
        } else {
          score.value.human += 1;
        }
        flippedCards.value.forEach((element) => {
          element.isHidden = true;
        });
      } else {
        turnComputer.value = !turnComputer.value;
      }

      await sleep(2000);

      flippedCards.value.forEach((element) => {
        element.isFlipped = false;
      });

      if (turnComputer.value) {
        computerPlayGame();
      }
    };

    const computerPlayGame = async () => {
      await sleep(2000);
      const possibleCards = cards.value.filter((card) => !card.isHidden);
      if (possibleCards.length === 0) return;

      for (let index = 0; index < 2; index++) {
        const randomCardIndex = getRandomIndex(possibleCards);
        flipCard(possibleCards[randomCardIndex].id);
        possibleCards.splice(randomCardIndex, 1);
        await sleep(500);
      }
    };

    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }

    const getRandomIndex = (array) => {
      return Math.floor(Math.random() * (array.length - 0)) + 0;
    };

    return {
      couplesCount,
      cards,
      createCards,
      flipCard,
      Card,
      score,
      computerPlayGame,
      turnComputer,
      isScoreVisible,
      userCannotFlipCard,
    };
  },
};
</script>

<style>
.generate-board {
  text-align: center;
  padding: 15px 0px 15px 0px;
  margin: 0 auto;
}
.board-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0px 100px 0px 100px;
  gap: 5px 5px;
}
.board-container.not-pointer {
  pointer-events: none;
  cursor: not-allowed;
}
</style>
