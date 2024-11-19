<template>
  <header>
    <section id="header_bar">
      <div>
        <toggle v-model="store.modeBool" :bool="store.modeBool" :on="'Invoices'" :off="'Clients'"/>
      </div>
      <div @click="store.overlayMode = store.overlayMode=='Settings' ? 'Hide': 'Settings'">Settings</div>
      <div @click="store.overlayMode = store.overlayMode=='Help' ? 'Hide': 'Help'">?</div>
    </section>
    <Messages/>
  </header>
  <main >
    <Transition name="overlay-fade">
      <side-overlay v-if="store.overlayMode=='Settings'" @close="store.overlayMode='Hide'">
        <Settings />
      </side-overlay>
    </Transition>

    <Transition name="overlay-fade">
      <side-overlay v-if="store.overlayMode=='Help'" @close="store.overlayMode='Hide'">
        <Help />
      </side-overlay>
    </Transition>

    <section 
      :class="{
        'hide-overflow': store.overlayMode !='Hide'
      }"
    >
      <component :is="mode"/>
    </section>

    <Transition name="invoice-fade">
      <Invoice v-if="store.showInvoice" />
    </Transition>
    
  </main>
</template>

<script setup lang="ts">
import Clients from './components/Clients.vue'
import Invoices from './components/Invoices.vue'
import Invoice from './components/Invoice.vue'
import Settings from './components/Settings.vue'
import Help from './components/Help.vue'
import Messages from './components/Messages.vue'

import store from './store'
import toggle from './components/subcomponents/toggle.vue'
import sideOverlay from './components/subcomponents/side-overlay.vue'
import { computed, onMounted, ref } from 'vue'

const isClients = ref(true);

const mode = computed(() => store.mode == 'Clients' ? Clients : Invoices)

onMounted(() => {
  store.init();
  window.onkeydown = (event)=>{
    if((event.key == 's' && (event.ctrlKey||event.metaKey)|| (event.which == 19))){
      switch (store.mode) {
        case 'Clients':
            store.activeInvoice?.save();
          break;
      
        default:
          break;
      }
    }
  }
  
})
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
    --lightgray: #f9f9f9 ;
    --middlegray: #ECECEC ;
    --gray:rgb(200,200,200);
    --black: rgb(22, 22, 22);
    --lightblue:rgb(227, 227, 227) ;
    --lightgreen:rgb(213, 235, 213) ;
    --anthrazite: rgb(40, 40, 40);
    --text-darkbg:rgb(250, 250, 250);
    --green-sum:  #6ae97b;
    --Success-col: #0ac022;
    --Neutral-col: white;
    --Warning-col: rgb(255, 128, 0);
    --Error-col: rgb(255, 0, 0);
    --border: .5px solid black;
    --text-inactive:rgb(181, 181, 181);
    --color-invoice:#0073c5;

    --fs0: .9rem;
    /* --fs1: calc(var(--fs0)*.9); */
    /* --fs2: calc(var(--fs0)*.7); */

    --radius: 3px;

    --shadow: 0 0 7px rgba(0,0,0,.1);

    --bgBlur: 5px;

    --padding-top:10em;

    --site-padding: .5rem;
  }

  body{
    line-height: 1.5;
    color:var(--black);
  }

  html,body,#app{
    font-family: diatype;
    font-size: var(--fs0);
    background-color: var(--lightgray);
  }

  small{
    font-size: var(--fs2);
  }

  header{
    position: fixed;
    z-index: 100;
    top:0;
    left:0;
    right:0;
    box-sizing: border-box;
    padding:var(--site-padding);
  }

  #header_bar{
    display: flex;
    width:100%;
    align-items: center;
  }

  .hide-overflow{
    overflow: hidden;
  }

  #header_bar > div{
    flex: 1;
  }

  #header_bar>div:not(:first-of-type){
    flex: 0;
    cursor: pointer;
    text-decoration: underline;
    text-decoration-style: dotted;
  }

  #header_bar>div:not(:first-of-type):hover{
    text-decoration-style: solid;
  }

  #header_bar div:nth-of-type(2){
    padding-right: calc(var(--site-padding) * 2);
  }

  main{
    margin-top: var(--padding-top);
  }

  .button{
    padding: .4em .8em;
    box-sizing: border-box;
    cursor: pointer;
    border-radius: var(--radius);
    display: inline-block;
  }

  .button.inactive{
    opacity: .2;
    pointer-events: none;
    cursor: not-allowed;
  }

  .button.black{
    background-color: var(--black);
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
    color:var(--text-inactive)
  }

  .client_row{
    position: relative;
  }

  /* .client_row::after
  {
    content: '_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _';
    position: absolute;
    display: block;
    left:0;
    right:0;
    bottom: 0; 
    line-height: 0;
    text-align-last: justify;
    pointer-events: none;
    white-space: nowrap;
  } */

</style>
