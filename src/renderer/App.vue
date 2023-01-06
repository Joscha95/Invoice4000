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
      <span @click="store.toggleMode()" :class="[store.mode == 'clients' ? 'round' : 'square', store.edit ? 'inactive' : '']"></span>
    </div>
    <component class="window_inner" :is="store.mode == 'clients' ? Clients : Invoices"></component>
    <div class="footer">
    ⚙️
    </div>
  </div>
  <div id="window_right" class="window_half">
    <div class="header"> 
      <span @click="store.toggleEdit()" v-if="store.activeClient || store.activeInvoice"> 🔨 </span>
    </div>
   <component class="window_inner" :is="store.mode == 'clients' ? VClient : VInvoice"></component>
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
      window.electron.getInvoices().then(res => {
        console.log(res);
        store.loadInvoices(res);
      });
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
  @font-face {
    font-family: surt;
    src: url('./fonts/AT Surt Regular.otf');
  }

  @font-face {
    font-family: chancery;
    src: url('./fonts/Apple Chancery.ttf');
  }

  :root{
    --lightgray: rgb(245, 245, 245) ;
    --gray:rgb(200,200,200);
    --lightblue:rgb(227, 227, 227) ;
    --lightgreen:rgb(213, 235, 213) ;
    --anthrazite: rgb(40, 40, 40);
    --text-darkbg:rgb(250, 250, 250);

    --fs0: 1.6rem;
    --fs1: calc(var(--fs0)*.5);
    --fs2: calc(var(--fs0)*.4);

    --site-padding: 1em;
  }

  html,body,#app{
    height:100%;
    font-family: surt;
  }

  small{
    font-size: var(--fs2);
  }

  #app{
    display: flex;
  }

  .chancery{
    font-family: chancery;
    font-size: calc(var(--fs1)*1.4);
  }

  .window_half{
    flex:1;
    position: relative;
    padding: var(--site-padding);
  }

  #window_left{
    border-right: 1px solid var(--anthrazite);
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
    margin-bottom: 5em;
  }

  .footer{
    position: absolute;
    bottom:0;
    left:0;
    padding:1em;
    cursor:pointer;
  }

  .header, .footer{
    font-size:var(--fs0);
  }

  #window_right .header{
    text-align: right;
  }

  #window_right .header span{
    cursor: pointer;
  }

  #window_left .header span{
    display: inline-block;
    width:1.5em;
    height:1.5em;
    background-color: var(--anthrazite);
    cursor: pointer;
  }

  #window_left .header span.round{
    border-radius:50%;
  }

  .window_inner{
    padding: 2em;
    box-sizing: border-box;
  }

  .inactive{
    opacity: .1;
    pointer-events: none;
  }
</style>
