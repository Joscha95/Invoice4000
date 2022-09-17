<template>

    <td> <div @input="modelValue.data.number = $event.target.innerText; updateValue() " :contenteditable="edit" > {{ modelValue.data.number }} </div> </td>
    <td> <div @input="modelValue.name = $event.target.innerText; updateValue() " :contenteditable="edit" > {{ modelValue.name }} </div> </td>
    <td> <div @input="modelValue.short = $event.target.innerText; updateValue() " :contenteditable="edit" > {{ modelValue.short }} </div> </td>
    <td> <div @input="modelValue.data.street = $event.target.innerText; updateValue() " :contenteditable="edit" > {{ modelValue.data.street }} </div> </td>
    <td> <div @input="modelValue.data.zip = $event.target.innerText; updateValue() " :contenteditable="edit" > {{ modelValue.data.zip }} </div> </td>
    <td> <div @input="modelValue.data.city = $event.target.innerText; updateValue() " :contenteditable="edit" > {{ modelValue.data.city }} </div> </td>
    
    <!-- <td> <Inputfield v-model="client.name" @changed="dataChanged" /> </td>
    <td> <Inputfield v-model="client.short" @changed="dataChanged" /> </td>
    <td> <Inputfield v-model="client.data.street" @changed="dataChanged" /> </td>
    <td> <Inputfield v-model="client.data.zip" @changed="dataChanged" /> </td>
    <td> <Inputfield v-model="client.data.city" @changed="dataChanged" /> </td> -->
  
</template>

<script lang="ts">
export default {
    data() {
        return {
        }
    },
    props:{
        modelValue: '',
        edit: false
    },
    emits:['changed','update:modelValue'],
    methods: {
        updateValue(e){
            this.$emit('update:modelValue', this.modelValue);
            this.$emit('changed', this.modelValue);
        }
    },
}

</script>

<style>
    div[contenteditable="false"]{
        white-space: nowrap;
    }
    div[contenteditable="true"]{
        appearance: none;
        border:0;
        outline: 0;
    }

</style>