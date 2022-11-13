<template>
    <div :style="`--span:${span || '6'}`">
        <small v-if="label">{{label}}</small>
        <div @input="updateValue"  :contenteditable="edit"> {{ modelValue }}</div>
    </div>
    
</template>

<script lang="ts">
export default {
    props:{
        modelValue: '',
        span: '',
        type: '',
        edit: false,
        label: ''
    },
    methods: {
        updateValue(e){
            let val = e.target.innerText;
            switch (this.type) {
                case 'number':
                    val = parseFloat(val);
                    break;
            
                default:
                    break;
            }

            this.$emit('update:modelValue', val);
            this.$emit('changed', val);
        }
    },
}

</script>

<style>
    div[contenteditable="false"]{
        white-space: nowrap;
        overflow: hidden;
    }
    div[contenteditable="true"]{
        background-color: white;
        appearance: none;
        border:0;
        outline: 0;
        white-space: normal;
        padding:3px;
        box-sizing:border-box;
    }

</style>