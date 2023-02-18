<template>
    <div>
        <small v-if="label">{{label}}</small>
        <div v-if="!edit" v-html="modelValue.replaceAll('\n','<br>')"> </div>
        <textarea ref="ele" v-else @input="updateValue" :value="modelValue" ></textarea>
    </div>
    
</template>

<script lang="ts">
export default {
    props:{
        modelValue: String,
        edit: Boolean,
        label: String
    },
    watch:{
      edit(){
        if(!this.edit) return
        this.$nextTick(function () {
            this.$refs.ele.style.height = "5px";
            this.$refs.ele.style.height = (this.$refs.ele.scrollHeight)+"px";
        })
      }
    },
    methods: {
        updateValue(e){
          const element = e.target;
          let val = e.target.value;

          console.log(this.modelValue);

          element.style.height = "5px";
          element.style.height = (element.scrollHeight)+"px";

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
    textarea{
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

    textarea:focus{
      border: var(--border);
    }

</style>