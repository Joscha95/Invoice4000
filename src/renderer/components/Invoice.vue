<template>
    <div class="invoice_editor">
        <div class="ie_form" v-if="store.activeInvoice">
            <div class="ie_adress">
                <select v-if="store.edit" v-model="clientId" @change="changeClient">
                    <option v-for="client in store.clients" :key="client.id" :value="client.id">{{ client.name }}</option>
                </select>
                <div>
                    <span v-if="!store.edit"> {{ store.activeInvoice.client.name }} <br> </span>
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
                        <td><basic-input v-model="position.text" :edit="store.edit"/></td>
                        <td v-if="store.edit"> <basic-input v-model="position.sum" :type="'number'" :edit="store.edit"/> </td>
                        <td v-else > {{ position.sum.toLocaleString('de-DE') }}E </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="store.edit" class="ie_position_add" @click="store.activeInvoice.addPosition()">+</div>
            <div class="ie_sum">Gesamt: {{ store.activeInvoice.sum.toLocaleString('de-DE') }}E</div>
        </div>
    </div>
</template>

<script>
import Invoice from '../classes/Invoice';
import store from '../store';
import basicInput from "./subcomponents/basic-input.vue";

export default {
    data() {
        return {
            store,
            clientId:''
        }
    },
    components:{
      basicInput
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

    .ie_position_add{
        text-align: center;
        cursor:pointer;
    }
</style>