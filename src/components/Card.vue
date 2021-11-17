<template>
  <div class="scene" :class="{ 'is-hidden': isHidden }">
    <div class="card" :class="{ 'is-flipped': isFlipped }" @click="handleFlip">
      <div class="card__face card__face--front">MEMORY</div>
      <div class="card__face card__face--back">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: Number,
      default: NaN,
    },
    isFlipped: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
    },
  },
  emits: ["handleFlip"],

  setup(props, context) {
    const handleFlip = () => {
      context.emit("handleFlip", props.id);
    };

    return {
      handleFlip,
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
.scene.is-hidden {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 2s, opacity 2s linear;
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
