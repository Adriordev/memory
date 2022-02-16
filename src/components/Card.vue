<template>
  <div class="scene max-w-max" :class="{ 'is-hidden': isHidden }">
    <div
      class="card shadow-lg w-24 h-24 md:w-36 md:h-36 lg:w-40 lg:h-40"
      :class="{ 'is-flipped': isFlipped }"
      @click="handleFlip"
    >
      <div class="card__face card__face--front"></div>
      <div
        class="card__face card__face--back"
        :style="{ backgroundImage: 'url(' + `${img}` + ')' }"
      >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isFlipped: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
    },
    img: {
      type: String,
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
  height: 100%;
  perspective: 1000px;
}
.card {
  position: relative;
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
  line-height: 35rem;
  color: white;
  text-align: center;
  font-weight: bold;
  font-size: 40px;
  backface-visibility: hidden;
}

.card__face--front {
  background-image: url("https://image.freepik.com/free-vector/flash-drive_53876-37485.jpg");
  background-position: center;
  background-position-y: 55%;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 2%;
}

.card__face--back {
  transform: rotateY(180deg);
  background-position: center;
  background-size: cover;
  border-radius: 2%;
}

</style>
