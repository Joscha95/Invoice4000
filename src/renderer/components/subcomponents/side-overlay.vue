<template>
  <div class="overlay">
    <div class="close-overlay" @click="$emit('close')"></div>
    <slot/>
  </div>
</template>

<script>
export default {

}
</script>

<style>
  .overlay,
  .close-overlay{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .overlay{
    backdrop-filter: blur(3px);
    z-index: 1;
  }

  .overlay > *:not(.close-overlay){
    background-color: white;
    position: absolute;
    bottom: 0;
    left: 13em;
    top: 0;
    right: 0;
    padding-top: var(--padding-top);
    padding-left: 5em;
    border-left: var(--border);
    box-sizing: border-box;
    transform: translateX(0);
  }

  .overlay-fade-enter-active,
  .overlay-fade-leave-active {
    transition: backdrop-filter 0.3s ease;
  }

  .overlay-fade-enter-to,
  .overlay-fade-leave-from {
    backdrop-filter: blur(var(--bgBlur));
  }

  .overlay-fade-enter-from,
  .overlay-fade-leave-to {
    backdrop-filter: blur(0);
  }

  .overlay-fade-enter-active > *:not(.close-overlay),
  .overlay-fade-leave-active > *:not(.close-overlay) {
    transition: transform 0.3s ease;
  }

  .overlay-fade-enter-from > *:not(.close-overlay),
  .overlay-fade-leave-to > *:not(.close-overlay) {
    transform: translateX(100%);
  }
</style>