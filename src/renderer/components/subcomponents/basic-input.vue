<template>
    <div>
        <small v-if="label">{{label}}</small>
        <div v-if="!edit"> {{ modelValue }}</div>
        <input :class="{big:big}" ref="ele" v-else @input="updateValue" :value="modelValue"/>
    </div>
    
</template>

<script lang="ts">
export default {
    props:{
        modelValue: String,
        edit: Boolean,
        label: String,
        big: Boolean
    },
    mounted(){
      if(!this.$refs.ele) return;
      this.$refs.ele.style.width = "5px";
      this.$refs.ele.style.width = (this.$refs.ele.scrollWidth+5)+"px";
    },
    watch:{
      edit(){
        if(!this.edit) return
        this.$nextTick(function () {
            this.$refs.ele.style.width = "5px";
            this.$refs.ele.style.width = (this.$refs.ele.scrollWidth+5)+"px";
        })
      }
    },
    methods: {
        updateValue(e){
          const element = e.target;
          let val = e.target.value;

          element.style.width = "5px";
          element.style.width = (element.scrollWidth+5)+"px";

          this.$emit('update:modelValue', val);
          this.$emit('changed', val);
        }
    },
}

</script>

<style scoped>
input{
  display: block;
  width:max-content;
  box-sizing:border-box;
  resize: none;
  border: var(--border);
  border-color: rgba(0,0,0,0.1) ;
  appearance: none;
  border-style: inset;
  outline:none;
  font-family: inherit;
  text-align: inherit;
  /* border-radius:var(--radius); */
}

input:focus{
  border: var(--border);
}

input.big{
  border-radius:var(--radius);
  padding: .7em .3em .4em .3em;
}

</style>