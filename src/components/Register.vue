<template>
  <div
    class="
      flex
      w-5/6
      max-h-max
      m-auto
      gap-2
      p-2
      rounded-lg
      shadow-md
      blurBackground
      md:w-3/4
    "
  >
    <div
      class="
        p-4
        w-full
        h-80
        bg-white
        rounded-lg
        border border-gray-200
        shadow-md
        text-center
        md:p-6 md:flex flex-1 md:w-1/2 md:justify-center
        items-center
        lg:p-8 lg:w-1/2
      "
    >
      <form action="#">
        <h3 class="text-2xl text-gray-900 text-center font-bold">Register</h3>
        <div class="space-y-4" >
          <label for="name" class="block mb-2 text-sm font-medium text-gray-900"
            >Your name</label
          >
          <input
            id="name"
            v-model="name"
            type="text"
            name="name"
            placeholder="ex. Henry"
            @focus="errName = ''"
          />
          <span class="error" :class="{ ' error-span': errName }">{{
            errName
          }}</span>
          <button
            class="
              w-full
              border-2
              text-black
              rounded-lg
              text-sm
              px-5
              py-2.5
              text-center
              uppercase
              shadow-2xl
              border-yellow-300
              bg-yellow-300
              hover:bg-yellow-500 hover:border-yellow-500 hover:text-black;
            "
            @click="RegisterName"
          >
            Enter
          </button>
        </div>
      </form>
    </div>

    <div
      class="
        hidden
        p-4
        h-80
        bg-white
        rounded-lg
        border border-gray-200
        shadow-md
        md:p-6 md:flex
        flex-col
        justify-center
        md:space-y-2 md:w-1/2
        lg:p-8 lg:w-1/2
      "
    >
      <div class="space-y-2">
        <h4 class="text-2xl text-gray-900 text-center font-bold">Welcome</h4>
        <h4 class="text-2xl text-gray-900 text-center font-bold">to</h4>
        <h3
          class="
            text-4xl text-gray-900 text-center
            font-bold
            rounded-lg
            px-5
            py-2.5
            uppercase
            shadow-2xl
            bg-yellow-300
          "
        >
          Memory's game
        </h3>
        <h4 class="text-lg text-gray-900 text-center font-bold pt-4">
          Enjoy with multiples game modes
        </h4>
      </div>
    </div>
  </div>
  <ModalRegister v-show="isModalVisible" @close="closeModal" />
</template>

<script>
import { ref } from "vue";
import ModalRegister from "./ModalRegister.vue";
import { useRouter } from "vue-router";
export default {
  name: "Register",
  components: {
    ModalRegister,
  },
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
    const isModalVisible = ref(false);

    //Computed

    // Functions
    const showModal = () => {
      isModalVisible.value = true;
    };
    const closeModal = () => {
      isModalVisible.value = false;
    };
    if (props.redirect) showModal();

    let session = localStorage.getItem("session");
    session = JSON.parse(session);
    if (session) {
      router.push({
        name: "Config",
      });
    }

    const RegisterName = () => {
      if (!name.value || name.value === ' ') {
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
      isModalVisible,
      ModalRegister,
      showModal,
      closeModal,
    };
  },
};
</script>
<style></style>
