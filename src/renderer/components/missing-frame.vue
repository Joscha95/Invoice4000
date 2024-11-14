<template>
  <div v-if="missing" class="green">
    <h3>found {{type}}</h3>
  </div>
  <div v-else class="red">
    <h3>missing quote</h3>
    <div class="help">
      Please add a Frame named “{{type}}_4000_{{name}}” <br> and 595x842 px to your File.
    </div>
  </div>
</template>

<script setup lang='ts'>

const props = defineProps<{
  missing:boolean,
  type: 'quote'|'invoice',
  name: string
}>();

</script>

<style scoped>
  
</style>