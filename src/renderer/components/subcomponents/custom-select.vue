<template>
  <div class="select">
    <div class="head" @click="open=!open">
      {{ modelValue }}
    </div>
    <ul :class={open}>
      <li v-for="(option,i) in options" :key="i" @click="select(i)" :data-selected="selectedIndex==i" >{{option}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data(){
    return{
      selectedIndex:0,
      open:false
    }
  },
  props:{
    options: Array,
    modelValue: String
  },
  methods:{
    select(i){
      this.selectedIndex = i;
      this.$emit('update:modelValue', this.options[i]);
      this.open = false;
    }
  }
}
</script>

<style scoped>
.select{
  user-select: none;
  display: inline-block;
  border: var(--border);
  padding: .3em .6em .2em .6em;
  border-radius:1em;
  text-transform: capitalize;
  background-color: white;
}
ul{
  list-style: none;
  appearance: none;
  margin:0;
  padding: 0;
  
}

li{
  cursor: pointer;
}

li[data-selected="true"]{
  display: none;
}

ul{
  display: none;
}

ul.open{
  display: block;
}

.head{
  cursor: pointer;
  
}
</style>