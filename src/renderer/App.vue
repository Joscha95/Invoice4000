<script setup lang="ts">
import Clients from './components/Clients.vue'
import Header from './components/Header.vue'
import { store } from './store.js'

window.electron.ipcRenderer.send('message', 'Hello from App.vue!');
</script>

<template>
  <div id="app">
    <Header @click="headerClicked"/>
    <Clients ref="client"> </Clients>
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
            this.store.clients.push({
              name: 'name',
              short: 'handle',
              data:{
                number: ("00" + (parseInt(this.store.clients[this.store.clients.length-1].data.number)+1)).slice(-3),
                street: 'street',
                city: 'city',
                zip: 'zip'
              }
            })
          break;
      
        default:
          break;
      }
      
    }
  },
  mounted(){
    window.electron.getClients().then(res => JSON.parse(res)).then(res => {
      store.clients = res;
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
  }

  body{
    font-size:1.1em;
    font-family:sans-serif;
  }
</style>
