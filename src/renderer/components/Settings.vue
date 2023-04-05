<template>
  <div id="settings" @drop="onDrop">
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
  <div class="layouts"> 
    <h2>{{store.settings.figmaFile.name}}</h2>
    <div v-if="store.settings.figmaFile.invoice" class="green">
      <h3>found invoice</h3>
    </div>
    <div v-else class="red">
      <h3>missing invoice</h3>
      <div class="help">
        Please add a Frame named “invoice_4000” <br> and 595x842 px to your File  
      </div>
    </div>
    <div v-if="store.settings.figmaFile.quote" class="green">
      <h3>found quote</h3>
    </div>
    <div v-else class="red">
      <h3>missing quote</h3>
      <div class="help">
        Please add a Frame named “quote_4000” <br> and 595x842 px to your File  
      </div>
    </div>
    <div class="select_fonts">
        <div v-for="font in store.settings.figmaFile.fonts" :key="font" class="select_font">
          <label>{{font}}: </label>

          <select :name="font" @change="setFonts($event,font)">
              <option disabled selected value> -- select a font -- </option>
              <option v-for="fontFile in store.fonts" :key="fontFile" :selected="store.settings.figmaFile.getFontFileName(font)==fontFile" :value="fontFile">{{fontFile}}</option>
          </select>
      </div>
    </div>

    <div class="button black" @click="uploadFont">Add Font</div>
  </div>

  <div>
    Taxrate: <basic-number-input v-model="store.settings.taxrate" :big="true" :inline="true" @change="store.settings.save()" :edit="true"/> %
  </div>
  <div>
    Last Invoice Number: <basic-number-input v-model="store.settings.invoicenumber" :big="true" :inline="true" @change="store.settings.save()" :edit="true"/>
  </div>
  
</div>
  
</template>

<script>
import store from '../store'
import basicInput from './subcomponents/basic-input.vue';
import basicNumberInput from './subcomponents/basic-number-input.vue';

export default {
  components: { basicInput,basicNumberInput },
    data(){
        return{
            store,
            layoutErr:null,
            loading:false
        }
    },
    methods:{
        async uploadFont(){
            const res = await window.electron.uploadFonts();
            if(res.type=='Success'){
              store.refreshFonts();
            }
            store.notify(res);
        },

        save(){
            store.settings.save();
        },

        setFonts(e,font){
            store.settings.figmaFile.setFontMap(font,e.target.value);
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
                this.loading = false;
                console.log(result);
                if(result.err) {
                  store.notify({type:'Error',text:'Figma: '+result.err});
                  return;
                }

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
  box-shadow: 0 0 10px rgba(0,0,0,.2);
  width: max-content;
  min-width:40em;
  padding: 2em;
  border-radius: 2em;
}

.select_fonts{
  margin: 1em 0;
}

</style>