<template>
  <li>
    <div>
      {{ layout.title }}
      <MissingFrame
        :name="layout.title"
        :missing="!!layout.quoteLayout"
        :type="'quote'"
      />
    </div>
    <div><input type="checkbox" name="" id="" :checked="checked"></div>
  </li>
</template>

<script setup lang='ts'>
import LayoutInvoice from '../classes/LayoutInvoice';
import store from '../store';
import MissingFrame from './missing-frame.vue';

const props = defineProps<{
  layout:LayoutInvoice,
  checked:boolean
}>();
</script>

<style scoped>
li{
  background-color: white;
  box-shadow: 0 0 7px rgba(0,0,0,.05);
  width: max-content;
  min-width:40em;
  padding: 2em;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

li:hover{
  background-color: var(--lightgray);
}

li > div:first-of-type{
  flex:1
}

input{
  pointer-events: none;
}
</style>