<script setup lang="ts">
const msg = 'Electron + Vue3 template';
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>No.</th>
        <th>Name</th>
        <th>Short</th>
        <th>Street</th>
        <th>Zip</th>
        <th>City</th>
      </tr>
    </thead>
    <tbody>
      
      <tr v-for="(client,i) in data" :key="i"
        :class="{active : activeRow==i, selected : selectedRow==i}"
        @dblclick="activeRow=i"
        @click="selectedRow=i;">
        <client-row  :edit="activeRow==i" v-model="data[i]" @changed="dataChanged"> </client-row>
      </tr>
    </tbody>
  </table>
</template>


<script lang="ts">
  import clientRow from "./subcomponents/client-row.vue";

  export default {
    expose:['deleteSelected'],
    data() {
      return {
        data:[],
        activeRow:null,
        selectedRow:null
      }
    },
    components:{
      clientRow
    },
    computed:{
      selectedClient(){
        if(!this.selectedRow) return null;
        return this.data[this.selectedRow];
      }
    },
    mounted() {
      window.electron.getClients().then(res => JSON.parse(res)).then(res => this.data = res);
    },
    methods: {
      dataChanged(){
        this.saveFile();
      },
      saveFile() {
          window.electron.ipcRenderer.send('saveClients', JSON.stringify(this.data));
      },
      deleteSelected(){
        this.data.splice(this.selectedRow,1);
      }
    }
  }
</script>
<style scoped>
  
  table{
    width: 100%;
    position: relative;
  }

  tr,td{
    position: relative;
  }

  tr.selected{
    background-color: lightblue;
  }

  tr.active{
    background-color: var(--gray);
  }

  td:nth-of-type(2){
    max-width: 10%;
  }

  th{
    text-align: left;
  }

  input{
    appearance: none;
    border:0;
    display: block;
  }

  th:not(:first-of-type),
  td:not(:first-of-type){
    padding-right:1em;
  }
</style>
