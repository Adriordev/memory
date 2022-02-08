<template>
  <div
    class="
      flex flex-auto flex-col
      justify-center
      mx-auto
      max-w-screen-md
      m-4
      p-4
      border
    "
  >
    <div class="flex flex-col p-10 border-2">
      <div class="block border-2 border-black max-w-max mx-auto">
        <label class="pl-2 pr-4 uppercase text-sm" for="name">User name:</label>
        <input id="name" v-model="name" type="text" @focus="errName = ''" />
      </div>

      <span class="error" :class="{ ' error-span': errName }">{{
        errName
      }}</span>
      <button class="btn" @click="RegisterName">Enter</button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
  name: "Register",
  props: {
    redirect: {
      type: String,
    },
  },
  setup(props) {
    // State
    const name = ref(null);
    const errName = ref("");
    const isRegister = ref(false);
    const router = useRouter();
    // Functions
    if (props.redirect) alert("Hi! you are new in game, please, enter a name");

    let session = localStorage.getItem("session");
    session = JSON.parse(session);
    if (session) {
      router.push({
        name: "Config",
      });
    }

    const RegisterName = () => {
      if (!name.value) {
        errName.value = "Enter a valid name please";
        return;
      }
      localStorage.setItem("session", JSON.stringify({ userName: name.value }));

      if (props.redirect) {
        router.push({
          path: props.redirect,
        });
      } else {
        router.push({
          name: "Config",
        });
      }
    };

    return {
      name,
      errName,
      RegisterName,
      isRegister,
    };
  },
};
</script>
<style></style>
