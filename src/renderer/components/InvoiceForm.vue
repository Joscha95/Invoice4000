<template>
    <div class="invoice_editor">
        <div class="ie_form" v-if="store.activeInvoice">
            <div class="ie_adress">
                <span class="ie_sender">Joscha Brüning • Legienstraße 18 • 24103 Kiel</span>
                <div>
                    {{ store.activeInvoice.client.name }} <br>
                    {{ store.activeInvoice.client.street }} <br>
                    {{ store.activeInvoice.client.zip }} {{ store.activeInvoice.client.city }} <br>
                </div>
            </div>
            <div class="ie_logo">JB</div>
            <h2>Rechnung</h2>
            <div class="ie_body_header">
                <div>{{ store.activeInvoice.number }}</div> <div>{{ store.activeInvoice.number }}</div> <div>{{ store.activeInvoice.date }}</div>
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
                        <td>{{ ('0'+i).slice(-3) }}</td>
                        <td>{{ position.text }}</td>
                        <td>{{ position.sum.toLocaleString('de-DE') }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="ie_position_add" @click="store.activeInvoice.addPosition()">+</div>
            <div class="ie_sum">Gesamt:{{ store.activeInvoice.sum }}</div>
        </div>
    </div>
</template>

<script>
import store from '../store'

export default {
    data() {
        return {
            store
        }
    },
}
</script>

<style scoped>
    .ie_form{
        background-color: rgb(189, 189, 189);
        width:70%;
        aspect-ratio:0.707;
        position: absolute;
        top:10%;
        left:50%;
        transform: translate(-50%);
    }

    .ie_body_header{
        display:flex;
    }

    .ie_logo{
        position: absolute;
        font-size: 3em;
        top:5%;
        right:10%;
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

    td{
        border: 1px solid black;
    }

    .ie_sum{
        text-align: right;
    }

    .ie_position_add{
        text-align: center;
        cursor:pointer;
    }
</style>