<template>

    <div @dblclick="edit=true" @blur="edit=false" @focusout="edit=false" @input="updateValue" :contenteditable="edit">{{ modelValue }}</div>
  
</template>

<script lang="ts">
export default {
    data() {
        return {
            edit:false
        }
    },
    props:{
        modelValue: ''
    },
    methods: {
        updateValue(e){
            this.$emit('update:modelValue', e.target.innerText);
            this.$emit('changed', e.target.innerText);
        }
    },
}

</script>

<style>
    div[contenteditable="false"]{
        background-color: var(--lightgray);
    }
    div[contenteditable="true"]{
        background-color: var(--gray);
        appearance: none;
        border:0;
        outline: 0;
    }

</style>