<template>
  <div class="container">
    <Card />
    <Card />
    <Card />
    <Card />
  </div>
</template>

<script>
import Card from "./components/Card.vue";

export default {
  name: "App",
  components: {
    Card,
  },
};
</script>

<style>
.container {
  display: flex;
  gap: 5px;
  justify-content: center;
}
</style>
