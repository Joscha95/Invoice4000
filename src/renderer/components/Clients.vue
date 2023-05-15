<script setup lang="ts">
</script>

<template>
  <div @click="newClient()" class="add button black">+</div>
  <div v-for="(client,i) in store.clients" :key="i"
    :class="{open : client.expanded,client_row:true}"
    >
    <div class="client_row_head" @click="client.expanded = !client.expanded">
      <div class="client_head_number"> {{ client.number }} </div>
      <div class="client_head_name"> {{ client.name }} </div>
      <div class="client_head_icount"> {{ client.invoices.length }} </div>
    </div>
    <div class="client_row_info">
      <VClient v-if="client.expanded" :client="client" @delete="deleteClient"/>
    </div>
  </div>
  <div v-if="!store.hasClients" class="client_row empty" @click="newClient()">create your first client</div>
</template>


<script lang="ts">
  import store from '../store'
  import Client from '../classes/Client'
  import VClient from './subcomponents/client.vue'

  export default {
    expose:['deleteSelected','saveFile'],
    data() {
      return {
        store
      }
    },
    components:{
      VClient
    },
    methods: {
      async deleteClient(client:Client){
        for (const invoice of client.invoices) {
          await invoice.delete();
        } 
        this.store.updateInvoices();
        this.store.clients.splice(this.store.clients.indexOf(client),1);
        this.store.saveClients();
      },
      newClient(){
        const newNum = this.store.clients.length > 0 ? ("00" + (parseInt(this.store.clients[this.store.clients.length-1].number)+1)).slice(-3) : "001";
        
        this.store.clients.push(new Client(newNum));
        this.store.activeClient = this.store.clients[this.store.clients.length-1];
        this.store.saveClients();
      }
    }
  }
</script>
<style scoped>
.client_row{
  padding: .5em 0 .4em 0;
  border-bottom: var(--border);
  box-sizing: border-box;
  clear: both;
}

.client_row.empty{
  border: var(--border);
  display:block;
  text-align: center;
  cursor: pointer;
}
.client_row_info{
  display: none;
}
.client_row.open{
  border: 0;
}
.client_row.open .client_row_info{
  display: grid;
}
.client_row_head{
  display: flex;
  cursor: pointer;
  padding: 0 var(--site-padding);
  justify-content: space-between;
}
.client_head_number,
.client_head_icount{
  flex-basis: 8%;
}
.client_head_name{
  flex: 1;
}
.client_head_icount{
  text-align: right;
}
.add.button{
  text-align: center;
  float: right;
  margin-bottom: var(--site-padding);
}
</style>
