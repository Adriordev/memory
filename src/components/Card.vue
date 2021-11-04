<template>
  <div class="scene">
    <div class="card" :class="{ 'is-flipped': flipped }" @click="flip">
      <div class="card__face card__face--front">MEMORY</div>
      <div class="card__face card__face--back">1</div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const flipped = ref(false);
    const flip = () => {
      flipped.value = true;
      setTimeout(() => (flipped.value = false), 3000);
    };
    return {
      flipped,
      flip,
    };
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.scene {
  width: 200px;
  height: 260px;
  border: 1px solid #ccc;
  margin: 40px 0;
  perspective: 600px;
}
.card {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transform-style: preserve-3d;
  transform-origin: center right;
  transition: transform 1s;
}
.card.is-flipped {
  transform: translateX(-100%) rotateY(-180deg);
}

.card__face {
  position: absolute;
  width: 100%;
  height: 100%;
  line-height: 260px;
  color: white;
  text-align: center;
  font-weight: bold;
  font-size: 40px;
  backface-visibility: hidden;
}

.card__face--front {
  background: aqua;
}

.card__face--back {
  background: coral;
  transform: rotateY(180deg);
}
</style>
