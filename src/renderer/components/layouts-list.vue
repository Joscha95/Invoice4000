<template>
  <ul>
    <LayoutListElement
      v-for="layout in layouts"
      :layout="layout"
      :checked="store.settings.figmaFile.invoiceID == layout.title"
      @click="
        store.settings.figmaFile.invoiceID = layout.title;
        store.settings.save();
      "
    />
  </ul>
</template>

<script setup lang='ts'>
import LayoutInvoice from '../classes/LayoutInvoice';
import store from '../store';
import LayoutListElement from './layout-list-element.vue';
const props = defineProps<{
  layouts:LayoutInvoice[];
}>();


</script>

<style scoped>
  ul{
    list-style: none;
    padding-inline-start: 0;
    display: flex;
    flex-direction: column;
    gap:1rem
  }
</style>