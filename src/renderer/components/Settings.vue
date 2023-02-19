<template>
<div id="settings" class="center" @drop="onDrop">
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
      <td> <div :class="{button:true,black:true, inactive: this.loading}" @click="loadLayout">load layout</div></td>
    </tr>
  </table>

  <div v-if="layoutErr != null">{{ layoutErr.err }}</div>
 

  <ul >
      <li 
      v-for="layout in store.settings.figmaFile.layouts" 
      :key="layout.name">
          <div>{{ layout.name }}</div>
          <div v-for="font in layout.fonts" :key="font" class="select_font">
              <label>{{font}}: </label>

              <select :name="font" @change="setFonts($event,layout,font)">
                  <option disabled selected value> -- select a font -- </option>
                  <option v-for="fontFile in store.fonts" :key="fontFile" :selected="layout.getFontFileName(font)==fontFile" :value="fontFile">{{fontFile}}</option>
              </select>
          </div>
          <div>{{layout.isValid==true ?'Layout is valid' : layout.isValid}}</div>
      </li>

  </ul>
  <div class="button black" @click="uploadFont">Add Font</div>
</div>
  
</template>

<script>
import store from '../store'
import basicInput from './subcomponents/basic-input.vue';

export default {
  components: { basicInput },
    data(){
        return{
            store,
            layoutErr:null,
            loading:false
        }
    },
    methods:{
        uploadFont(){
            window.electron.uploadFonts();
        },

        save(){
            store.settings.save();
        },

        setFonts(e,layout,font){
            layout.setFontMap(font,e.target.value);
            this.store.settings.save();
        },

        loadLayout(e){
            if(this.loading) return;
            this.loading = true;
            var myHeaders = new Headers();
            myHeaders.append("X-Figma-Token", store.settings.figmaAccessToken);

            var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
            };

            fetch("https://api.figma.com/v1/files/"+store.settings.figmaFileId, requestOptions)
            .then(response => response.text())
            .then(text => JSON.parse(text))
            .then(result => {
                console.log(result);
                this.loading = false;
                this.store.settings.figmaFile.import(result);
                this.store.settings.save();
            })
            .catch(error => {
                this.layoutErr = error;
                this.loading = false;
            });
        }

    }
}
</script>

<style scoped>
table{
  width:100%;
}
td:first-of-type{
  width: 13em;
}

</style>