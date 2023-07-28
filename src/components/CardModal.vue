<template type="text/x-template" id="modal-template">

    <div class="modal-mask fixed z-50 top-0 left-0 w-full h-full bg-black  flex items-center justify-center ">
      <div class="modal-wrapper table">
        <div class="modal-container bg-white w-[80%] rounded-md shadow-lg p-5 overflow-y-scroll flex-shrink-0">
            

          <div class="modal-header">
            <slot name="header">Default Header</slot>
          </div>
          <div class="modal-body">
            <slot name="body">Default Body</slot>
          </div>
          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup >
// const emit = defineEmits(['close']);

// const emitClose = () => {
//     // Emit the 'close' event to notify the parent component to close the modal
//     emit('close');
// };
</script>


<style scoped>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    width: 700px;
    min-width: 700px;
    max-width: 700px;

    flex-shrink: 0;

    height: 100vh;
    min-height: 60vh;
    max-height: 100vh;
    
    margin: 0px auto;
    padding: 5px 10px 5px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
    margin-top: 0;
    color: #42b983;
}

.modal-body {
    margin: 20px 0;
}

.modal-default-button {
    float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
</style>