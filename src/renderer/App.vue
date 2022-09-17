<script setup lang="ts">
import Clients from './components/Clients.vue'
import Header from './components/Header.vue'

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
  methods:{
    headerClicked(e){
      console.log(this.$refs.client);
      this.$refs.client.deleteSelected();
    }
  }
}
</script>

<style>
  :root{
    --gray: #dcdcdc;
  }
</style>
