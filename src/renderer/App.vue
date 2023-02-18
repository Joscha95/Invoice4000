<script setup lang="ts">
import Clients from './components/Clients.vue'
import Invoices from './components/Invoices.vue'
import Settings from './components/Settings.vue'

import store from './store'
import CustomSelect from './components/subcomponents/custom-select.vue'
</script>

<template>
  <header>
    <CustomSelect v-model="store.mode" :options="[ 'Clients',  'Invoices', 'Settings']"/>
  </header>
  <main >
    <component :is="store.mode"/>
  </main>
</template>

<script lang="ts">
export default {
  expose:[],
  data() {
    return {
      store,
      mode:'clients',
      S:false,
      
    }
  },
  components:{
    Invoices,
    Settings,
    Clients,
    CustomSelect
  },
  mounted(){
    window.electron.getClients().then(res => JSON.parse(res)).then(res => {
      store.loadClients(res);
      window.electron.getInvoices().then(res => {
        store.loadInvoices(res);
      });
    });

    window.electron.getFonts().then(res => JSON.parse(res)).then(res => {
      store.setFonts(res);
    })

    window.electron.getSettings().then(res => JSON.parse(res)).then(res => {
      store.setSettings(res);
    })
    

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
    font-family: receipt;
    src: url('./fonts/fake receipt.otf');
  }

  :root{
    --lightgray: #FAFAFA ;
    --middlegray: #ECECEC ;
    --gray:rgb(200,200,200);
    --lightblue:rgb(227, 227, 227) ;
    --lightgreen:rgb(213, 235, 213) ;
    --anthrazite: rgb(40, 40, 40);
    --text-darkbg:rgb(250, 250, 250);
    --border: 1px solid black;

    --fs0: .9rem;
    --fs1: calc(var(--fs0)*.9);
    --fs2: calc(var(--fs0)*.7);

    --border-radius-small: 5px;

    --site-padding: .5rem;
  }

  html,body,#app{
    font-family: surt;
    font-size: var(--fs0);
    background-color: var(--lightgray);
  }

  small{
    font-size: var(--fs2);
  }

  header{
    position: fixed;
    top:var(--site-padding);
    left:var(--site-padding);
  }

  main{
    margin-top: 10em;
  }

  .button{
    padding: .4em .8em;
    box-sizing: border-box;
    cursor: pointer;
    border-radius: var(--border-radius-small);
  }

  .button.black{
    background-color: black;
    color:white;
  }

  
</style>
