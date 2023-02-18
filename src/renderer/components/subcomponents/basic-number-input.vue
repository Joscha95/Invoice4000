<template>
    <div>
        <small v-if="label">{{label}}</small>
        <div v-if="!edit"> {{ modelValue }}</div>
        <input ref="tarea" v-else @input="updateValue" :value="modelValue"/>
    </div>
    
</template>

<script lang="ts">
export default {
    props:{
        modelValue: Number,
        edit: Boolean,
        label: String
    },
    methods: {
        updateValue(e){
            let val = e.target.value;
            val = parseFloat(val) || 0;

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
</style>