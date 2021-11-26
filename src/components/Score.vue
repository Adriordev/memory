<template>
  <div v-if="!endGame">
    <h3>Cartas ganadas jugador: {{ human }}</h3>
    <h3>Cartas ganadas maquina: {{ computer }}</h3>
  </div>
  <div v-else>
    <h2 v-if="human >= computer">HAS GANADO ({{ human }} - {{ computer }})</h2>
    <h2 v-else>TE HAN GANADO ({{ human }} - {{ computer }})</h2>
  </div>
</template>
<script>
export default {
  props: {
    human: { type: Number },
    computer: { type: Number },
    endGame: { type: Boolean },
  },
  setup() {
    return {};
  },
};
</script>
<style></style>
