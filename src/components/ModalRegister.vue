<template>
  <div
    class="
      modal-backdrop
      fixed
      top-0
      bottom-0
      left-0
      right-0
      bg-black bg-opacity-30
      flex flex-1
      justify-center
      items-center
    "
  >
    <div
      class="modal bg-white shadow-lg overflow-x-auto flex flex-col rounded-lg"
      role="dialog"
      aria-labelledby="modalTitle"
      aria-describedby="modalDescription"
    >
      <header
        id="modalTitle"
        class="
          modal-header
          p-4
          flex flex-1
          relative
          bg-yellow-300
          text-black text-xl
          font-bold
          justify-between
          border-b-2
        "
      >
        <slot name="header"> Welcome! </slot>
      </header>

      <section
        id="modalDescription"
        class="modal-body relative text-center text-lg font-semibold px-20 py-10 space-y-2"
      >
        <slot name="body">
          <p>First of all</p>
          <p>we need a NAME to continue</p>
        </slot>
      </section>

      <footer
        class="
          modal-footer
          p-4
          flex flex-col
          justify-end
          items-center
          border-t-2
        "
      >
        <button
          type="button"
          class="btn"
          aria-label="Close modal"
          @click="close"
        >
          Close
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalRegister",
  emits: ["close"],
  setup(props, context) {
    const close = () => {
      context.emit("close");
    };
    return {
      close,
    };
  },
};
</script>
<style>
.modal-footer {
  border-top: 1px solid #eeeeee;
  flex-direction: column;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}
</style>
