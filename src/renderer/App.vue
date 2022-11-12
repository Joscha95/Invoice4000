<script setup lang="ts">
import Clients from './components/Clients.vue'
import Header from './components/Header.vue'
import Invoices from './components/Invoices.vue'
import VClient from './components/VClient.vue'
import VInvoice from './components/VInvoice.vue'

import Client from './classes/Client'
import Invoice from './classes/Invoice'

import store from './store'
</script>

<template>
  <div id="window_left" class="window_half">
    <div class="header"> 
      <span @click="store.toggleMode()" :class="store.mode == 'clients' ? 'round' : 'square'"></span>
    </div>
    <component :is="store.mode == 'clients' ? Clients : Invoices"></component>
  </div>
  <div id="window_right" class="window_half">
    <div class="header"> 
      <span @click="store.toggleEdit()" v-if="store.activeClient || store.activeInvoice"> 🔨 </span>
    </div>
   <component :is="store.mode == 'clients' ? VClient : VInvoice"></component>
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
    // headerClicked(e){
    //   switch (e) {
    //     case 'client:delete':
    //         this.$refs.client.deleteSelected();
    //       break;
    //     case 'client:add':
    //         
    //       break;
    //     case 'invoice:new':
    //         this.store.addInvoice(new Invoice('0',this.store.selectedClient || this.store.clients[0]))
    //       break;
      
    //     default:
    //       break;
    //   }
      
    // }
    
  },
  mounted(){
    window.electron.getClients().then(res => JSON.parse(res)).then(res => {
      store.loadClients(res);
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
    --lightgray: rgb(245, 245, 245) ;
    --gray:rgb(200,200,200);
    --lightblue:rgb(227, 227, 227) ;
    --lightgreen:rgb(213, 235, 213) ;
    --anthrazite: rgb(40, 40, 40);
    --text-darkbg:rgb(250, 250, 250);

    --fs0: 2rem;
    --fs1: calc(var(--fs0)*.5);
    --fs2: calc(var(--fs0)*.45);

    --site-padding: 1em;
  }

  html,body,#app{
    height:100%;
  }

  #app{
    display: flex;
  }

  .window_half{
    flex:1;
    padding: var(--site-padding);
  }

  #window_left{
    border-right: 2px solid var(--anthrazite);
  }

  body{
    font-size:var(--fs1);
    font-family:sans-serif;
    padding:0;
    margin:0;
    background-color: var(--lightgray);
  }

  .header{
    height:2em;
  }

  #window_right .header{
    text-align: right;
  }

  #window_right .header span{
    cursor: pointer;
  }

  #window_left .header span{
    display: inline-block;
    width:2em;
    height:2em;
    background-color: var(--anthrazite);
    cursor: pointer;
  }

  #window_left .header span.round{
    border-radius:50%;
  }
</style>
