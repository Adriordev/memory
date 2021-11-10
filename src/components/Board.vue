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
    const selectedCards = ref([]);

    const createCards = () => {
      cards.value = [];
      for (var i = 1; i <= 2 * couplesCount.value; i++) {
        const oneCard = {
          text: i,
          isFlipped: false,
        };
        cards.value = [...cards.value, oneCard];
      }
    };

    const flipCard = (index) => {
      let flippedCardsCount = 0;
      for (var i = 0; i < cards.value.length; i++) {
        if (cards.value[i].isFlipped === true) {
          flippedCardsCount++;
        }
      }
      if (flippedCardsCount < 2) {
        const selectCardtoFlip = cards.value[index];
        selectCardtoFlip.isFlipped = true;
        selectedCards.value.push(selectCardtoFlip);
      }
      if (flippedCardsCount === 1) {
        checkCards();
      }
    };

    const checkCards = () => {
      if (selectedCards.value[0].text === selectedCards.value[1].text) {
        console.log("PREMIO");
      } else {
        setTimeout(() => {
          selectedCards.value.forEach((element) => {
            element.isFlipped = false;
          });

          selectedCards.value = [];
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
