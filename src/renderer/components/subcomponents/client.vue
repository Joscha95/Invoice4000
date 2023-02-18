<script setup lang="ts">
</script>

<template>
  <div class="client_editor">
    <div class="edit button black" @click="edit=!edit; if(!edit) store.saveClients();">edit</div>
    <div class="ce_props">
      <div class="number" style="--area:number">
        <basicInput v-model="client.number" :edit="edit"/>
      </div>

      <div class="name" style="--area:name">
        <basicInput v-model="client.name" :edit="edit"/>
      </div>
      
      <div class="adress" style="--area:adress">
        <small>adress</small>
        <basicInput v-model="client.street" :edit="edit"/>
        <basicInput v-model="client.city" :edit="edit"/>
        <basicInput v-model="client.zip" :edit="edit"/>       
      </div>
      
      <div class="invoices" style="--area:invoices">
        <invoices-grid :invoices="client.invoices" :client="client"></invoices-grid>
      </div>

      <div class="short" style="--area:short">
        <basicInput v-model="client.short" :label="'short'" :span="1" :edit="edit"/>
      </div>

      <div class="contact" style="--area:contact">
        <basicInput v-model="client.contact" :label="'contact'" :span="1" :edit="edit"/>
      </div>
    
    </div>
    
  </div>
</template>


<script lang="ts">
  import basicInput from "./basic-input.vue";
  import store from '../../store'
  import Client from '../../classes/Client'
  import invoicesGrid from './invoices-grid.vue'

  export default {
    expose:['deleteSelected','saveFile'],
    props:{
      client: Client
    },
    data() {
      return {
        activeClient:null,
        store,
        edit:false
      }
    },
    components:{
      basicInput,
      invoicesGrid
    },
    methods: {
      saveFile() {
          window.electron.ipcRenderer.send('saveClients', JSON.stringify(this.store.clients));
      },
      deleteSelected(){
        this.store.clients.splice(this.store.clients.indexOf(this.client),1);
        this.client = null;
      }
      
    }
  }
</script>
<style scoped>
  .client_editor{
    position: relative;
    padding: var(--site-padding);
    background-color: var(--middlegray);
    border-radius:var(--border-radius-small);
    width:100%;
    box-sizing: border-box;
  }

  .ce_props{
    display: grid;
    grid-template-columns: repeat(4,1fr);
    grid-template-rows: repeat(4,5em);
    grid-template-areas: 
    "number number name name"
    "adress adress short contact"
    "invoices invoices quotes quotes"
    "invoices invoices quotes quotes"
    ;
  }

  .ce_props > div{
    grid-area: var(--area);
  }

  .client_new{
    cursor: pointer;
    position: absolute;
    left:0;
    right:0;
    bottom:0;
    top:0;
  }

  .edit{
    position: absolute;
    right:var(--site-padding);
  }

  input{
    appearance: none;
    border:0;
    display: block;
  }

</style>
