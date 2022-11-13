<script setup lang="ts">
</script>

<template>
  <table class="window_inner">
    <tbody>
      
      <tr v-for="(client,i) in store.clients" :key="i"
        :class="{selected : store.activeClient==client}"
        @click="store.activeClient = client">
        <td> {{ client.number }} </td>
        <td> {{ client.name }} </td>
      </tr>
    </tbody>
  </table>

</template>


<script lang="ts">
  import basicInput from "./subcomponents/basic-input.vue";
  import store from '../store'

  export default {
    expose:['deleteSelected','saveFile'],
    data() {
      return {
        store
      }
    },
    components:{
      basicInput
    },
    methods: {
      deleteSelected(){
        if(!this.selectedClient) return;
        this.store.clients.splice(this.store.clients.indexOf(this.selectedClient),1);
        this.selectedClient = null;
        this.activeClient = null;
      }
    }
  }
</script>
<style scoped>
  
  table{
    width: 100%;
    position: relative;
  }

  td{
    position: relative;
    cursor: pointer;
    padding: .5em;
    font-weight:normal;
  }

  td:first-of-type{
    width:1em;
    font-size: var(--fs2);
  }


  tr.selected{
    background-color: var(--lightblue);
  }

  tr.active{
    background-color: var(--gray);
  }

  td:nth-of-type(2){
    max-width: 10%;
  }

  input{
    appearance: none;
    border:0;
    display: block;
  }

  td:not(:first-of-type){
    padding-right:1em;
  }
</style>
