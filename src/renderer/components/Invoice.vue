<template>
    <div class="invoice_editor" v-if="store.activeInvoice">
      <div id="invoice_bg" @click="store.activeInvoice = null;edit=false;"></div>
      <div class="ie_form">
        <button-wrapper>
          <div class="edit button red" v-if="edit" @click="store.deleteActiveInvoice();edit=false">delete</div>
          <div class="edit button black" @click="store.activeInvoice.export()">export</div>
          <div class="edit button black" @click="edit=!edit; if(!edit) store.activeInvoice.save()">{{edit ? "save" : "edit"}}</div>
        </button-wrapper>
        
          <div class="ie_adress">
              <select v-if="edit" v-model="clientId" @change="changeClient">
                  <option v-for="client in store.clients" :key="client.id" :value="client.id">{{ client.name }}</option>
              </select>
              <div>
                  <span v-if="!edit"> {{ store.activeInvoice.client.name }} <br> </span>
                  {{ store.activeInvoice.client.street }} <br>
                  {{ store.activeInvoice.client.zip }} {{ store.activeInvoice.client.city }} <br>
              </div>
          </div>
          
          <h1>Rechnung</h1>

          <div class="ie_body_header">
              <div>Nr. {{ store.activeInvoice.number }}</div> <div>Kundennr. {{ store.activeInvoice.client.number }}</div> <div>{{ store.activeInvoice.date }}</div>
          </div>
          <table>
              <thead>
                  <tr>
                      <th>Pos.</th>
                      <th>Leistung</th>
                      <th>Gesamtpreis</th>
                  </tr>
                  
              </thead>
              <tbody>
                  <tr v-for="(position, i) in store.activeInvoice.positions" :key="i">
                      <td>{{ ('0'+(i+1)).slice(-3) }}</td>
                      <td><basic-textarea v-model="position.text" :edit="edit"/></td>
                      <td v-if="edit"> <basic-number-input v-model="position.sum" :edit="edit"/> </td>
                      <td v-else > {{ position.sum.toLocaleString('de-DE') }}E </td>
                  </tr>
              </tbody>
          </table>
          <div v-if="edit" class="ie_position_add_subtract">
            <span @click="store.activeInvoice.addPosition()" class="button grey">+</span>
            <span @click="store.activeInvoice.removePosition()" class="button grey">-</span>
            </div>
          <div class="ie_sum">Summe: {{ store.activeInvoice.sum.toLocaleString('de-DE') }}E</div>
          <div class="ie_sum">Mehrwertsteuer(<basic-number-input v-model="store.activeInvoice.taxrate" :inline="true" :edit="edit"/>%): {{ store.activeInvoice.taxSum.toLocaleString('de-DE') }}E</div>
          <div class="ie_sum">Gesamt: {{ store.activeInvoice.overallSum.toLocaleString('de-DE') }}E</div>
      </div>
    </div>
</template>

<script>
import Invoice from '../classes/Invoice';
import store from '../store';
import buttonWrapper from "./subcomponents/button-wrapper.vue";
import basicInput from "./subcomponents/basic-input.vue";
import basicTextarea from "./subcomponents/basic-textarea.vue";
import basicNumberInput from "./subcomponents/basic-number-input.vue";

export default {
    data() {
        return {
            store,
            clientId:'',
            edit:false
        }
    },
    components:{
      basicInput,
      basicTextarea,
      basicNumberInput,
      buttonWrapper
    },
    watch:{
        'store.activeInvoice'(newInvoice){
            if(!newInvoice) return;
            this.clientId = newInvoice.client.id;
        }
    },
    methods:{
        changeClient(e){
            store.activeInvoice.client = store.getClient(e.target.value) || store.activeInvoice.client;
        }
    }
}
</script>

<style scoped>

.invoice_editor{
  position: fixed;
  top:0;
  left:0;
  bottom:0;
  right:0;
  z-index: 2000;
  background-color: rgba(255,255,255,.76);
  backdrop-filter: blur(15px);
}

.ie_form{
  background-color: white;
  border:var(--border);
  border-radius: var(--border-radius-small);
  position: absolute;
  bottom: 10%;
  top:10%;
  aspect-ratio: 9/13;
  padding: var(--site-padding);
  padding-top: 4em;
  box-sizing: border-box;
  left:50%;
  transform: translateX(-50%);
}

#invoice_bg{
  position: absolute;
  left:0;
  right:0;
  bottom:0;
  top:0;
}

h1{
  margin-top: 2em;
}
.ie_body_header{
  display:flex;
  margin: 1em 0;
}

.ie_body_header > div{
  flex:1;
}

.ie_body_header > div:last-of-type{
  text-align:right;
}

.ie_body_header > div:nth-of-type(2){
  text-align:center;
}

thead th{
  border-bottom: 1px solid black;
  box-sizing: border-box;
}

table{
  width:100%;
}

th{
  text-align: left;
}

th:first-of-type{
  width:3em;
}

th:last-of-type,td:last-of-type{
  width:4em;
  text-align: right;
}

.ie_sum{
  text-align: right;
  margin-top: 1em;
}

.ie_position_add_subtract{
  text-align: center;
  margin-top: var(--site-padding);
}

.ie_position_add_subtract span{
  width:100px;
  display: inline-block;
}
.ie_position_add_subtract span+span{
  margin-left: var(--site-padding);
}
</style>