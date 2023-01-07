<template>
<div id="settings" class="center" @drop="onDrop">
    <h2>Settings</h2>
    <h3>Layouts</h3>
    <ul >
        <li 
        v-for="layout in store.layouts" 
        :key="layout.name">
            <div>{{ layout.name }}</div>
            <div v-for="font in layout.fonts" :key="font">
                <label for="cars">{{font}}: </label>

                <select name="cars" id="cars">
                    <option v-for="font in store.fonts" :key="font" value="font">{{font}}</option>
                </select>
            </div>
            
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
            store
        }
    },
    methods:{
        uploadFont(){
            window.electron.uploadFonts();
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
</style>