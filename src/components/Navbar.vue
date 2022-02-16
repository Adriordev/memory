<template>
  <nav class="w-full min-h-min shadow-lg blurBackground">
    <div class="flex justify-center items-center h-14 md:h-16 lg:h-20 uppercase">
      
      <h1 class="font-bold text-sm md:text-lg lg:text-xl"><router-link to="/">memory</router-link></h1>
      <!-- <a href="#" @click="deleteStorage">reset</a> -->
    </div>
  </nav>
</template>
<script>
export default {
  name: "Navbar",

  setup() {
    const deleteStorage = () => {
      localStorage.removeItem("session");
    };
    return {
      deleteStorage,
    };
  },
};
</script>
<style></style>
