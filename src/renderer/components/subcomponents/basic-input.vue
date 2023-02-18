<template>
    <div :style="`--span:${span || '6'}`">
        <small v-if="label">{{label}}</small>
        <div @input="updateValue"  :contenteditable="edit"> {{ modelValue }}</div>
    </div>
    
</template>

<script lang="ts">
export default {
    props:{
        modelValue: String,
        span: Number,
        type: String,
        edit: Boolean,
        label: String
    },
    methods: {
        updateValue(e){
            let val = e.target.innerText;
            
            switch (this.type) {
                case 'number':
                    val = parseFloat(val) || 0;
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