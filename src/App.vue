<template>
  <div class="app container mx-auto min-h-screen min-w-full bg-gray-100">
    <nav
      class="
        flex
        justify-around
        items-center
        lg:h-20
        md:h-14
        sm:h-12
        bg-yellow-200
        border-2
      "
    >
      <div><router-link to="/">HOME</router-link></div>
      <div><a href="#" @click="deleteStorage">RESET USERNAME</a></div>
    </nav>
    <div>
      <h1 class="text-center pt-10 text-5xl animate-fadeInDown">MEMORY GAME</h1>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
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
