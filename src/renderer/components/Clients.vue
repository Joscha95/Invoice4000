<script setup lang="ts">
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>No.</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
      
      <tr v-for="(client,i) in store.clients" :key="i"
        :class="{selected : selectedClient==client}"
        @dblclick="setActiveClient(client)"
        @click="selectedClient = client;">
        <td> {{ client.number }} </td>
        <td> {{ client.name }} </td>
      </tr>
    </tbody>
  </table>

  <div  class="client_editor" :class="{show: store.activeClient }">
    <div class="background" @click="setActiveClient(null)"></div>
    <div class="ce_inner">
      <div class="ce_form" v-if="store.activeClient">
        <div class="ce_props">
          <basic-input v-model="store.activeClient.number" :span="1"/>
          <basic-input v-model="store.activeClient.name" :span="5"/>
          <basic-input v-model="store.activeClient.short"/>
          <basic-input v-model="store.activeClient.street"/>
          <basic-input v-model="store.activeClient.city"/>
          <basic-input v-model="store.activeClient.zip"/>
          <basic-input v-model="store.activeClient.contact" :span="3"/>
          <basic-input v-model="store.activeClient.phone" :span="3"/>
        </div>
        <div class="ce_invoices">
          <div class="ce_invoices_header">
            <span>Invoices</span><span class="ce_invoices_add">+</span>
          </div>
        </div>
      
      </div>
    </div>
    
  </div>
</template>


<script lang="ts">
  import basicInput from "./subcomponents/basic-input.vue";
  import store from '../store'

  export default {
    expose:['deleteSelected','saveFile'],
    data() {
      return {
        activeClient:null,
        selectedClient:null,
        store
      }
    },
    components:{
      basicInput
    },
    methods: {
      saveFile() {
          window.electron.ipcRenderer.send('saveClients', JSON.stringify(this.store.clients));
      },
      deleteSelected(){
        if(!this.selectedClient) return;
        this.store.clients.splice(this.store.clients.indexOf(this.selectedClient),1);
        this.selectedClient = null;
        this.activeClient = null;
      },
      setActiveClient(client){
        this.activeClient = client;
        this.selectedClient = client;
        this.store.activeClient = this.activeClient;
      }
    }
  }
</script>
<style scoped>
  
  table{
    width: 100%;
    position: relative;
    margin-top: 2em;
  }

  .client_editor,
  .client_editor .background{
    position: absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
  }

  .client_editor{
    pointer-events: none;
  }

  .client_editor.show{
    pointer-events: all;
  }

  .client_editor .background{
    opacity: 0;
    transition: opacity .3s ease;
  }

  .client_editor.show .background{
    opacity:1;
  }
  .ce_inner{
    position: absolute;
    width:50%;
    right:0;
    top:0;
    bottom:0;

    background-color: white;
    border-left:1px solid black;

    transition: transform .3s ease;
    transform: translate(100%);
    padding: 1em;
    padding-top: 2em;
    font-size:var(--fs0);
    box-sizing:border-box;
  }

  .client_editor.show .ce_inner{
    transform:translate(0%);
  }

  .ce_props{
    display: grid;
    grid-template-columns: repeat(6,1fr);
    grid-template-rows: auto;
  }

  .ce_props > div{
    grid-column: span var(--span);
  }

  .ce_invoices{
    margin-top:1em;
  }

  .ce_invoices_add{
    float: right;
    cursor: pointer
  }

  td,th{
    position: relative;
    cursor: pointer;
    padding: .5em;
    font-weight:normal;
  }

  th:first-of-type,td:first-of-type{
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

  th{
    text-align: left;
    font-size: var(--fs2);
  }

  input{
    appearance: none;
    border:0;
    display: block;
  }

  th:not(:first-of-type),
  td:not(:first-of-type){
    padding-right:1em;
  }
</style>
