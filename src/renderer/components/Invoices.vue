<template>
    <div @dblclick="store.setActiveInvoice(invoice)" v-for="invoice in store.invoices" :key="invoice.number">
        #{{ invoice.number }} {{ invoice.client.name }} {{ invoice.sum }}
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