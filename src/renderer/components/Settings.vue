<template>
  <div id="settings">
  <table>
    <tr>
      <td>Figma Access token </td>
      <td><basic-input v-model="store.settings.figmaAccessToken" :edit="true" :big="true"/></td>
    </tr>
    <tr>
      <td>Figma File Id </td>
      <td><basic-input v-model="store.settings.figmaFileId" :edit="true" :big="true"/></td>
    </tr>
    <tr>
      <td> </td>
      <td> <div :class="{button:true,black:true, inactive: loading}" @click="loadLayout">load layout</div></td>
    </tr>
  </table>

  <div v-if="layoutErr != null">{{ layoutErr.err }}</div>
  <div class="layouts"> 
    
    <h2>File: {{store.settings.figmaFile.name}}</h2>

    <LayoutsList
      :layouts="store.settings.figmaFile.invoiceLayouts"
    />

    <div class="select_fonts">
      <h3>Fonts</h3>
      <div v-for="font in store.settings.figmaFile.fonts" :key="font" class="select_font">
        <label>{{font}}: </label>

        <select :name="font" @change="setFonts($event,font)">
            <option disabled selected value> -- select a font -- </option>
            <option v-for="fontFile in store.fonts" :key="fontFile" :selected="store.settings.figmaFile.getFontFileName(font)==fontFile" :value="fontFile">{{fontFile}}</option>
        </select>
      </div>
      <div class="button black" @click="uploadFont">Add Font</div>
    </div>
   
  </div>

  <div>
    Taxrate: <basic-number-input v-model="store.settings.taxrate" :big="true" :inline="true" @change="store.settings.save()" :edit="true"/> %
  </div>
  <div>
    Last Order Number: <basic-number-input v-model="store.settings.orderNumber" :big="true" :inline="true" @change="store.settings.save()" :edit="true"/>
  </div>
  <div>
    Last Invoice Number: <basic-number-input v-model="store.settings.invoiceNumber" :big="true" :inline="true" @change="store.settings.save()" :edit="true"/>
  </div>
  <div>
    <div :class="{button:true,black:true}" @click="exportData">export data</div> <div :class="{button:true,black:true}" @click="importData">import data</div>
  </div>
  
</div>
  
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue';
import store from '../store'
import basicInput from './subcomponents/basic-input.vue';
import basicNumberInput from './subcomponents/basic-number-input.vue';
import LayoutsList from './layouts-list.vue';

const layoutErr:Ref<any|undefined> = ref(undefined);
const loading:Ref<boolean> = ref(false);

async function uploadFont(){
    const res = await window.electron.uploadFonts();
    if(res.type=='Success'){
      store.refreshFonts();
    }
    store.notify(res);
}

async function exportData(){
    const res = await window.electron.exportAppData();
    
    store.notify(res);
}

async function importData(){
    const res = await window.electron.importAppData();
    store.reload();
    store.notify(res);
}

function save(){
    store.settings.save();
}

function setFonts(e:Event,font:string){
    store.settings.figmaFile.setFontMap(font,(e.target as HTMLSelectElement).value);
    store.settings.save();
}

function loadLayout(){
    if(loading.value) return;
    loading.value = true;
    var myHeaders = new Headers();
    myHeaders.append("X-Figma-Token", store.settings.figmaAccessToken);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    fetch("https://api.figma.com/v1/files/"+store.settings.figmaFileId, requestOptions)
    .then(response => response.text())
    .then(text => JSON.parse(text))
    .then(result => {
        loading.value = false;
        console.log(result);
        if(result.err) {
          store.notify({type:'Error',text:'Figma: '+result.err});
          return;
        }

        store.settings.figmaFile.import(result);
        store.settings.save();
    })
    .catch(error => {
        layoutErr.value = error;
        loading.value = false;
    });
}
</script>

<style scoped>

#settings{
  overflow-y: auto;
}

.select_fonts{
  line-height: 2;
}

#settings >*{
  margin: 2em 0;
}
table{
  width:100%;
}
td:first-of-type{
  width: 13em;
}

h2,h3{
  margin:0;
}
h2{
  margin-bottom: 1em;
}

.layouts{
  background-color: white;
  box-shadow: var(--shadow);
  width: max-content;
  min-width:40em;
  padding: 2em;
  border-radius: .5rem;
}

.select_fonts{
  margin: 1em 0;
}

</style>