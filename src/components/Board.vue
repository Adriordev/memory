<template>
  <div class="generate-board">
    <h3>Board</h3>
    <label for="couplesCount">Numero de parejas: </label>
    <input
      type="number"
      v-model="couplesCount"
      @keyup.enter="createCards((visible = true))"
    />
    <button @click="createCards((visible = true))">crear</button>
  </div>
  <div v-if="visible === true">
    <h3>Cartas ganadas jugador: {{ counter.human }}</h3>
    <h3>Cartas ganadas maquina: {{ counter.computer }}</h3>
  </div>

  <div class="board-container" :class="{ 'not-pointer': notPointer }">
    <Card
      v-bind="item"
      @handleFlip="flipCard"
      v-for="item in cards"
      :key="item.id"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import Card from "./Card.vue";
import axios from "axios";
export default {
  components: {
    Card,
  },

  setup() {
    const couplesCount = ref();
    const cards = ref([]);
    const counter = ref([]);
    const notPointer = ref(false);

    const createCards = async () => {
      cards.value = [];
      counter.value = { human: 0, computer: 0 };
      notPointer.value = false;
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
      console.log("cards.value :>> ", cards.value);
    };

    const flipCard = (id) => {
      const flippedCardsCount = cards.value.filter(
        (card) => card.isFlipped
      ).length;

      if (flippedCardsCount < 2) {
        const selectCardtoFlip = cards.value.find((c) => c.id === id);
        selectCardtoFlip.isFlipped = true;
      }

      checkIfCoupleWasFound();
    };

    const checkIfCoupleWasFound = () => {
      const flippedCards = cards.value.filter((card) => card.isFlipped);
      if (flippedCards.length < 2) return;

      if (flippedCards[0].img === flippedCards[1].img) {
        if (
          flippedCards[0].isHidden === false &&
          flippedCards[1].isHidden === false &&
          notPointer.value === false
        ) {
          counter.value.human += 1;
        } else {
          counter.value.computer += 1;
        }
        flippedCards.forEach((element) => {
          element.isHidden = true;
        });
      }
      setTimeout(() => {
        flippedCards.forEach((element) => {
          element.isFlipped = false;
        });
      }, 2000);
      notPointer.value = !notPointer.value;
      if (notPointer.value === true) {
        turnComputer();
      }
    };

    const turnComputer = async () => {
      await sleep(3000);
      const possibleCards = cards.value.filter((card) => {
        return card.isHidden === false;
      });
      if (possibleCards.length === 0) return;

      const rollcard1 =
        Math.floor(Math.random() * (possibleCards.length - 0)) + 0;
      const playCard1 = possibleCards[rollcard1];

      possibleCards.splice(rollcard1, 1);

      const rollcard2 =
        Math.floor(Math.random() * (possibleCards.length - 0)) + 0;
      const playCard2 = possibleCards[rollcard2];

      console.log(playCard1, playCard2);
      flipCard(playCard1.id);
      await sleep(1000);
      flipCard(playCard2.id);
    };

    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
      }
      return array;
    };

    return {
      couplesCount,
      cards,
      createCards,
      flipCard,
      Card,
      counter,
      visible: ref(false),
      turnComputer,
      notPointer,
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
}
</style>
