<template>
<div class="invoices">
    <div @click="store.setActiveInvoice(invoice)" v-for="invoice in store.invoices" :key="invoice.number">
        {{ invoice.number }} {{ invoice.client.name }} {{ invoice.sum }}
    </div>
    <div @click="store.newInvoice()" class="invoice_new"> new </div>
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
    .invoices{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: auto;
    }

    .invoices div{
        background-color: white;
        height:9em;
        cursor: pointer;
    }

    .invoice_new{
        text-align: center;
        padding-top: 3.5em;
        box-sizing: border-box;
    }
</style>