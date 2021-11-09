<template>
  <div class="generate-board">
    <h3>Board</h3>
    <label for="couple">Numero de parejas: </label>
    <input type="number" v-model="couple" @keyup.enter="handleClick" />
    <button @click="handleClick">crear</button>
  </div>
  <div class="board-container">
    <Card
      :text="index"
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
    let cards = ref();

    const handleClick = () => {
      cards.value = 2 * couple.value;
    };

    const flip = (flipped) => {
      flipped.value = true;
      setTimeout(() => (flipped.value = false), 3000);
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
