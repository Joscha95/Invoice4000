<script setup lang="ts">
</script>

<template>

  <div v-if="store.activeClient" class="client_editor">
    <div class="ce_inner">
      <div class="ce_form">
        <div class="ce_props">
          <basic-input v-model="store.activeClient.number" :span="2" :edit="store.edit"/>
          <basic-input v-model="store.activeClient.name" :span="2" :edit="store.edit"/>
          
          <div style="--span:2;">
            <basic-input v-model="store.activeClient.street" :edit="store.edit"/>
            <basic-input v-model="store.activeClient.city" :edit="store.edit"/>
            <basic-input v-model="store.activeClient.zip" :edit="store.edit"/>
          </div>
          

          <basic-input v-model="store.activeClient.short" :span="1" :edit="store.edit"/>
          <basic-input v-model="store.activeClient.contact" :span="1" :edit="store.edit"/>
        </div>
        <div class="ce_invoices">
          
        </div>
      
      </div>
    </div>
    
  </div>

  <div v-else @click="newClient">
    <span>Create new Client</span>
  </div>
</template>


<script lang="ts">
  import basicInput from "./subcomponents/basic-input.vue";
  import store from '../store'
  import Client from '../classes/Client'

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
      newClient(){
        this.store.clients.push(new Client(("00" + (parseInt(this.store.clients[this.store.clients.length-1].number)+1)).slice(-3)));
        this.store.activeClient = this.store.clients[this.store.clients.length-1];
      }
    }
  }
</script>
<style scoped>
  .ce_props{
    display: grid;
    grid-template-columns: repeat(4,1fr);
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


  input{
    appearance: none;
    border:0;
    display: block;
  }

</style>
