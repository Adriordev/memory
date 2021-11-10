<template>
  <div class="generate-board">
    <h3>Board</h3>
    <label for="couple">Numero de parejas: </label>
    <input type="number" v-model="couple" @keyup.enter="handleClick" />
    <button @click="handleClick">crear</button>
  </div>
  <div class="board-container">
    <Card
      :text="item.text"
      :isFlipped="item.isFlipped"
      :index="index"
      @handleFlip="flip"
      v-for="(item, index) in cards"
      :key="index"
    />
  </div>
</template>
<script>
import { onMounted, onUpdated, ref } from "vue";
import Card from "./Card.vue";
export default {
  components: {
    Card,
  },
  setup() {
    let couple = ref();
    let cards = ref([]);
    let selectedCards = ref([]);

    const handleClick = () => {
      cards.value = [];
      for (var i = 1; i <= 2 * couple.value; i++) {
        let oneCard = {
          text: i,
          isFlipped: false,
        };
        cards.value = [...cards.value, oneCard];
      }
      //console.log(JSON.stringify(cards.value));
    };

    const flip = (index) => {
      let countCards = 0;

      for (var i = 0; i < cards.value.length; i++) {
        if (cards.value[i].isFlipped === true) {
          countCards++;
        }
      }

      if (countCards < 2) {
        const selectCardtoFlip = cards.value[index];
        selectCardtoFlip.isFlipped = true;
        selectedCards.value.push(selectCardtoFlip);
      }
      if (countCards === 1) {
        if (selectedCards.value[0].text === selectedCards.value[1].text) {
          console.log("PREMIO");
        } else {
          setTimeout(() => {
            selectedCards.value.forEach((element) => {
              element.isFlipped = false;
            });
          }, 2000);
        }
      }
    };

    onMounted(() => {
      console.log("mounted!");
    });
    onUpdated(() => {
      console.log("updated!");
    });

    return {
      couple,
      cards,
      handleClick,
      flip,
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
