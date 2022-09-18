<script setup lang="ts">
import Clients from './components/Clients.vue'
import Header from './components/Header.vue'
import InvoiceForm from './components/InvoiceForm.vue'
import Invoices from './components/Invoices.vue'
import Client from './classes/Client'
import Invoice from './classes/Invoice'
import store from './store'

window.electron.ipcRenderer.send('message', 'Hello from App.vue!');
</script>

<template>
  <div id="app">
    <Header @click="headerClicked"/>
    <Clients ref="client"> </Clients>
    <Invoices/>
    <InvoiceForm/>
  </div>
</template>

<script lang="ts">
export default {
  expose:[],
  data() {
    return {
      store,
      mode:'clients'
    }
  },
  methods:{
    headerClicked(e){
      switch (e) {
        case 'client:delete':
            this.$refs.client.deleteSelected();
          break;
        case 'client:add':
            this.store.clients.push(new Client(("00" + (parseInt(this.store.clients[this.store.clients.length-1].number)+1)).slice(-3)))
          break;
        case 'invoice:new':
            this.store.addInvoice(new Invoice('0',this.store.selectedClient || this.store.clients[0]))
          break;
      
        default:
          break;
      }
      
    }
  },
  mounted(){
    window.electron.getClients().then(res => JSON.parse(res)).then(res => {
      store.setClients(res);
    });

    window.onkeydown = (event)=>{
      if((event.key == 's' && (event.ctrlKey||event.metaKey)|| (event.which == 19))){
        switch (this.mode) {
          case 'clients':
              this.$refs.client.saveFile();
            break;
        
          default:
            break;
        }
      }
    }
    
  }
}
</script>

<style>
  :root{
    --lightgray: rgb(227, 227, 227) ;
    --gray:rgb(200,200,200);
    --lightblue:rgb(227, 227, 227) ;
    --lightgreen:rgb(213, 235, 213) ;
    --anthrazite: rgb(40, 40, 40);
    --text-darkbg:rgb(250, 250, 250);

    --fs0: 2rem;
    --fs1: calc(var(--fs0)*.6);
    --fs2: calc(var(--fs0)*.45);
  }

  body{
    font-size:var(--fs1);
    font-family:sans-serif;
    padding:0;
    margin:0;
  }
</style>
