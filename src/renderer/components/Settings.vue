<template>
<div id="settings" class="center" @drop="onDrop">
    <h2>Settings</h2>
    <h3>Layout</h3>
     <div>
        <label for="figmaauth">Figma Access token </label>
        <input type="text" name="figmaauth" v-model="store.settings.figmaAccessToken" @input="save">
    </div>
    <div>
        <label for="fileid">Figma File Id </label>
        <input type="text" name="fileid"  v-model="store.settings.figmaFileId" @input="save">
    </div>
    <div v-if="layoutErr != null">{{ layoutErr.err }}</div>
    <div :class="{button:true, inactive: this.loading}" @click="loadLayout">load Layout</div>

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
    <div class="button" @click="uploadFont">Add Font</div>
</div>
  
</template>

<script>
import store from '../store'

export default {
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
    #settings{
        position: absolute;
        background-color: white;
        width:80%;
        height:50%;
        overflow: scroll;
        margin: 0 auto;
        box-shadow: 0px 0px 50px rgba(0,0,0,.3);
        padding: .5em;
        border-radius:10px;
        box-sizing: border-box;
    }

    .inactive{
        opacity: .5;
        pointer-events: none;
    }

    .select_font{
        margin: 1em 0;
    }
</style>