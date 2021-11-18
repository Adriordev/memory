<template>
  <div class="generate-board">
    <h3>Board</h3>
    <label for="couplesCount">Numero de parejas: </label>
    <input type="number" v-model="couplesCount" @keyup.enter="createCards" />
    <button @click="createCards">crear</button>
  </div>
  <div class="board-container">
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

    const createCards = async () => {
      cards.value = [];

      const response = await axios.get(
        `https://picsum.photos/v2/list?limit=${couplesCount.value}`
      );
      const images = response.data.map((img) => img.download_url);

      for (let index = 0; index < images.length; index++) {
        const card = {
          text: index,
          isFlipped: false,
          isHidden: false,
          img: images[index],
        };
        cards.value.push(card);
        const card2 = {
          text: index,
          isFlipped: false,
          isHidden: false,
          img: images[index],
        };
        cards.value.push(card2);
      }
      shuffle(cards.value);
      cards.value.map((e, index) => [...cards.value, (e.id = index)]);
      console.log("cards.value :>> ", cards.value);
    };

    const flipCard = (id) => {
      const flippedCardsCount = cards.value.filter(
        (card) => card.isFlipped
      ).length;

      if (flippedCardsCount < 2) {
        const selectCardtoFlip = cards.value[id];
        selectCardtoFlip.isFlipped = true;
      }

      checkIfCoupleWasFound();
    };

    const checkIfCoupleWasFound = () => {
      const flippedCards = cards.value.filter((card) => card.isFlipped);
      if (flippedCards.length < 2) return;

      if (flippedCards[0].text === flippedCards[1].text) {
        flippedCards.forEach((element) => {
          element.isHidden = true;
        });
      }
      setTimeout(() => {
        flippedCards.forEach((element) => {
          element.isFlipped = false;
        });
      }, 2000);
    };

    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    return {
      couplesCount,
      cards,
      createCards,
      flipCard,
      Card,
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
</style>
