<template>
    <div class="invoice_editor">
      <div id="invoice_bg" @click="store.showInvoice = false;edit=false;"></div>
      <div class="ie_form" v-if="store.activeInvoice">
        <button-wrapper>
          <div class="edit button black" v-if="store.activeInvoice.quote && edit" @click="store.activeInvoice.convertToInvoice()">convert to invoice</div>
          <div class="edit button red" v-if="edit" @click="store.deleteActiveInvoice();edit=false">delete</div>
          <div 
            class="edit button black" 
            :class="{
              'inactive': store.activeInvoice.quote ? !store.settings.figmaFile.currentLayout?.quoteLayout : false
            }"
            @click="store.activeInvoice.export(store.settings.figmaFile.currentLayout)"
          >
            export
          </div>
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
          
          <h1>{{store.activeInvoice.quote ? 'Angebot' : 'Rechnung'}}</h1>

          <div class="ie_body_header">
              <div>Nr. {{ store.activeInvoice.quote ? store.activeInvoice.order_number : store.activeInvoice.invoice_number }}</div> <div>Kundennr. {{ store.activeInvoice.client.number }}</div> <div>{{ store.activeInvoice.date }}</div>
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
                      <td v-if="edit"> <basic-number-input v-model="position.price" :edit="edit" :align="'right'" :inline="true"/> </td>
                      <td v-else > {{ position.price.toLocaleString('de-DE') }}E </td>
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
          <div><basic-textarea v-model="store.activeInvoice.remarks" :edit="edit"/></div>
      </div>
    </div>
</template>

<script setup lang="ts">
import store from '../store';
import buttonWrapper from "./subcomponents/button-wrapper.vue";
import basicInput from "./subcomponents/basic-input.vue";
import basicTextarea from "./subcomponents/basic-textarea.vue";
import toggle from "./subcomponents/toggle.vue";
import basicNumberInput from "./subcomponents/basic-number-input.vue";
import { ref } from 'vue';

const edit = ref(false);

const clientId = ref(store.activeInvoice?.client.id || '');

function changeClient(e:Event){
  if(store.activeInvoice)
    store.activeInvoice.client = store.getClient((e.target as HTMLSelectElement).value) || store.activeInvoice.client;
}

</script>

<style scoped>

.invoice_editor{
  position: fixed;
  top:0;
  left:0;
  bottom:0;
  right:0;
  backdrop-filter: blur(var(--bgBlur));
}

  .invoice-fade-enter-active,
  .invoice-fade-leave-active {
    transition: backdrop-filter 0.3s ease;
  }

  .invoice-fade-enter-to,
  .invoice-fade-leave-from {
    backdrop-filter: blur(var(--bgBlur));
  }

  .invoice-fade-enter-from,
  .invoice-fade-leave-to {
    backdrop-filter: blur(0);
  }

    .invoice-fade-enter-active .ie_form,
  .invoice-fade-leave-active .ie_form {
    transition: transform 0.3s ease, opacity 0.1s ease;
  }

  

.ie_form{
  background-color: white;
  border:var(--border);
  position: absolute;
  bottom: 10%;
  top:10%;
  aspect-ratio: 9/13;
  padding: var(--site-padding);
  padding-top: 4em;
  box-sizing: border-box;
  left:50%;
  transform: translateX(-50%) translateY(0);
  opacity: 1;
  border-radius: var(--radius);
}

.invoice-fade-enter-from  .ie_form,
.invoice-fade-leave-to .ie_form {
  transform: translateX(-50%) translateY(100%);
  opacity: 0;
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
  box-sizing: border-box;
}

thead tr{
  position: relative;
}
thead tr::after{
  content: '';
  width:100%;
  left:0;
  bottom:0;
  display: block;
  position: absolute;
  border-bottom: var(--border);
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