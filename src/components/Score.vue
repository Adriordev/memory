<template>
  <h3>Cartas ganadas jugador: {{ human }}</h3>
  <h3>Cartas ganadas maquina: {{ computer }}</h3>
</template>
<script>
export default {
  props: {
    human: { type: Number },
    computer: { type: Number },
  },
  setup() {
    return {};
  },
};
</script>
<style></style>
