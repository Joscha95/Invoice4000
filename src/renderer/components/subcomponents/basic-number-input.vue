<template>
    <div :class="{inline:inline}">
        <small v-if="label">{{label}}</small>
        <div v-if="!edit"> {{ modelValue }}</div>
        <input ref="ele" :class="{big:big,inline:inline}" v-else @input="updateValue" :value="modelValue"/>
    </div>
    
</template>

<script lang="ts">
export default {
    props:{
        modelValue: Number,
        edit: Boolean,
        label: String,
        big: Boolean,
        inline:Boolean
    },
    mounted(){
      if(!this.$refs.ele) return;
      this.$refs.ele.style.width = "5px";
      this.$refs.ele.style.width = (this.$refs.ele.scrollWidth+5)+"px";
    },
    methods: {
        updateValue(e){
            let val = e.target.value;
            val = parseFloat(val) || 0;

            e.target.style.width = "5px";
            e.target.style.width = (e.target.scrollWidth+5)+"px";

            this.$emit('update:modelValue', val);
            this.$emit('changed', val);
        }
    },
}

</script>

<style>
input{
  display: block;
  width:100%;
  box-sizing:border-box;
  resize: none;
  border: var(--border);
  border-color: rgba(0,0,0,0.1) ;
  appearance: none;
  border-style: inset;
  outline:none;
  font-family: inherit;
  /* border-radius:var(--border-radius-small); */
}

input:focus{
  border: var(--border);
}
input.big{
  border-radius:var(--border-radius-small);
  padding: .7em .3em .4em .3em;
}
.inline{
  display: inline-block;
}
</style>