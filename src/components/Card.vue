<template>
  <div class="scene">
    <div class="card" :class="{ 'is-flipped': flipped }" @click="handleFlip">
      <div class="card__face card__face--front">MEMORY</div>
      <div class="card__face card__face--back">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
export default {
  props: {
    text: {
      type: Number,
      default: NaN,
    },
  },
  emits: ["handleFlip"],

  setup(props, context) {
    const flipped = ref(false);
    const handleFlip = () => {
      context.emit("handleFlip", flipped);
      console.log();
    };

    return {
      handleFlip,
      flipped,
    };
  },
};
</script>

<style>
.scene {
  width: 21%;
  height: 260px;
  border: 1px solid #ccc;
  /* margin: 40px 0; */
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
