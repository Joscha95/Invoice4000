<script setup lang="ts">
import Clients from './components/Clients.vue'
import Invoices from './components/Invoices.vue'
import Invoice from './components/Invoice.vue'
import Settings from './components/Settings.vue'
import Help from './components/Help.vue'

import store from './store'
import toggle from './components/subcomponents/toggle.vue'
import sideOverlay from './components/subcomponents/side-overlay.vue'
</script>

<template>
  <header>
    <div>
      <toggle v-model="isClients" :bool="isClients" :on="'Clients'" :off="'Invoices'"/>
    </div>
    <div @click="store.overlayMode = store.overlayMode=='Settings' ? 'Hide': 'Settings'">Settings</div>
    <div @click="store.overlayMode = store.overlayMode=='Help' ? 'Hide': 'Help'">?</div>
  </header>
  <main >
    <Transition name="overlay-fade">
      <side-overlay v-if="store.overlayMode=='Settings'" @close="store.overlayMode='Hide'">
        <Settings />
      </side-overlay>
    </Transition>

    <Transition name="overlay-fade">
      <side-overlay v-if="store.overlayMode=='Help'">
        <Help />
      </side-overlay>
    </Transition>

    <component :is="store.mode"/>

    <Transition name="invoice-fade">
      <Invoice v-if="store.showInvoice" />
    </Transition>
    
  </main>
</template>

<script lang="ts">
export default {
  expose:[],
  data() {
    return {
      store,
      isClients:true,
      S:false,
      
    }
  },
  components:{
    Invoices,
    Invoice,
    Settings,
    Clients,
    toggle,
    Help
  },
  watch:{
    isClients(){
      this.store.mode = this.isClients ? 'clients' : 'invoices'
    }
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
  /* @font-face {
    font-family: surt;
    src: url('./fonts/AT Surt Regular.otf');
  }

  @font-face {
    font-family: receipt;
    src: url('./fonts/fake receipt.otf');
  } */

  :root{
    --lightgray: #FAFAFA ;
    --middlegray: #ECECEC ;
    --gray:rgb(200,200,200);
    --lightblue:rgb(227, 227, 227) ;
    --lightgreen:rgb(213, 235, 213) ;
    --anthrazite: rgb(40, 40, 40);
    --text-darkbg:rgb(250, 250, 250);
    --border: .5px solid black;

    --fs0: .9rem;
    --fs1: calc(var(--fs0)*.9);
    --fs2: calc(var(--fs0)*.7);

    --border-radius-small: 5px;

    --bgBlur: 3px;

    --padding-top:10em;

    --site-padding: .5rem;
  }

  body{
    line-height: 1.5;
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
    z-index: 100;
    display: flex;
    top:0;
    left:0;
    right:0;
    box-sizing: border-box;
    padding:var(--site-padding);
    align-items: center;
  }

  header > div{
    flex: 1;
  }

  header>div:not(:first-of-type){
    flex: 0;
    cursor: pointer;
    text-decoration: underline;
    text-decoration-style: dotted;
  }

  header>div:not(:first-of-type):hover{
    text-decoration-style: solid;
  }

  header div:nth-of-type(2){
    padding-right: calc(var(--site-padding) * 2);
  }

  main{
    margin-top: var(--padding-top);
  }



  .button{
    padding: .4em .8em;
    box-sizing: border-box;
    cursor: pointer;
    border-radius: var(--border-radius-small);
    display: inline-block;
  }

  .button.inactive{
    opacity: .2;
  }

  .button.black{
    background-color: black;
    color:white;
  }

  .button.grey{
    background-color: rgb(211, 211, 211);
    color:white;
  }

  .button.red{
    background-color: red;
    color:white;
  }

  .button.grey:hover{
    background-color: rgb(189, 189, 189);
  }

  .button.grey:active{
    background-color: rgb(128, 128, 128);
  }

  .red{
    color: red
  }

  .green{
    color: #1aff00;
  }

  .help{
    font-size: var(--fs2);
    color:#c8c8c8
  }


  
</style>
