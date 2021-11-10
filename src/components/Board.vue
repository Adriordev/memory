<template>
  <div class="generate-board">
    <h3>Board</h3>
    <label for="couplesCount">Numero de parejas: </label>
    <input type="number" v-model="couplesCount" @keyup.enter="createCards" />
    <button @click="createCards">crear</button>
  </div>
  <div class="board-container">
    <Card
      :text="item.text"
      :isFlipped="item.isFlipped"
      :index="index"
      @handleFlip="flipCard"
      v-for="(item, index) in cards"
      :key="index"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import Card from "./Card.vue";
export default {
  components: {
    Card,
  },
  setup() {
    const couplesCount = ref();
    const cards = ref([]);

    const createCards = () => {
      cards.value = [...Array(couplesCount.value * 2).keys()].map((index) => {
        return {
          text: index,
          isFlipped: false,
        };
      });
    };

    const flipCard = (index) => {
      const flippedCardsCount = cards.value.filter(
        (card) => card.isFlipped
      ).length;

      if (flippedCardsCount < 2) {
        const selectCardtoFlip = cards.value[index];
        selectCardtoFlip.isFlipped = true;
      }

      checkIfCoupleWasFound();
    };

    const checkIfCoupleWasFound = () => {
      const flippedCards = cards.value.filter((card) => card.isFlipped);
      if (flippedCards.length < 2) return;

      if (flippedCards[0].text === flippedCards[1].text) {
        console.log("PREMIO");
      } else {
        setTimeout(() => {
          flippedCards.forEach((element) => {
            element.isFlipped = false;
          });
        }, 2000);
      }
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
