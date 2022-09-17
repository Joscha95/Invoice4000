<script setup lang="ts">
const msg = 'Electron + Vue3 template';
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
        :class="{selected : selectedRow==i}"
        @dblclick="setActiveRow(i)"
        @click="selectedRow=i;">
        <td> {{ client.data.number }} </td>
        <td> {{ client.name }} </td>
      </tr>
    </tbody>
  </table>

  <div  class="client_editor" :class="{show: store.activeClient }">
    <div class="background" @click="setActiveRow(null)"></div>
    <div class="client_editor_inner">
      <div class="client_editor_form" v-if="store.activeClient">
        <div class="client_editor_props">
          <basic-input v-model="store.activeClient.data.number"/>
          <basic-input v-model="store.activeClient.name"/>
          <basic-input v-model="store.activeClient.short"/>
          <basic-input v-model="store.activeClient.data.street"/>
          <basic-input v-model="store.activeClient.data.city"/>
          <basic-input v-model="store.activeClient.data.zip"/>
        </div>
        <div class="client_editor_invoices">
        
        </div>
      
      </div>
    </div>
    
  </div>
</template>


<script lang="ts">
  import basicInput from "./subcomponents/basic-input.vue";
  import { store } from './../store.js'

  export default {
    expose:['deleteSelected','saveFile'],
    data() {
      return {
        activeRow:null,
        selectedRow:null,
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
        if(!this.selectedRow) return;
        this.store.clients.splice(this.selectedRow,1);
      },
      setActiveRow(ind){
        console.log(ind)
        this.activeRow = ind;
        this.store.activeClient = this.store.clients[ind];
      }
    }
  }
</script>
<style scoped>
  
  table{
    width: 100%;
    position: relative;
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
    background-color: rgba(0, 0, 0, 0.2);
    opacity: 0;
    transition: opacity .3s ease;
  }

  .client_editor.show .background{
    opacity:1;
  }
  .client_editor_inner{
    position: absolute;
    width:50%;
    right:0;
    top:0;
    bottom:0;
    background-color: white;
    transition: transform .3s ease;
    transform: translate(100%);
    padding: 1em;
    font-size:2em;
    box-sizing:border-box;
  }

  .client_editor.show .client_editor_inner{
    transform:translate(0%);
  }

  .client_editor_props{
    display: grid;
  }

  td,th{
    position: relative;
    cursor: pointer;
    padding: .5em;
    font-weight:normal;
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
