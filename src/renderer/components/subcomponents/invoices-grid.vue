<template>
<div class="invoices">
    <div :class="['invoice_prev', store.edit && store.activeInvoice.number != invoice.number ? 'inactive' : '']" 
        @click="store.setActiveInvoice(invoice)" 
        v-for="invoice in invoices" 
        :key="invoice.number"
        :style="`--bg-col:${invoice.color};`">
        <div> <span class="invoice_number">{{ invoice.number }}</span> <br>({{ invoice.client.short }}) </div> 
        <div> {{ invoice.sum.toLocaleString('de-DE') }}E </div>
    </div>
    <div @click="store.newInvoice()" class="invoice_prev invoice_new chancery" style="--bg-col:white;"> <span>new</span> </div>
</div>
    
</template>

<script>
    import store from '../../store'

    export default {
        data() {
            return {
                store
            }
        },
        props:{
            invoices:Array
        }
    }
</script>

<style scoped>
    .invoices{
        display: grid;
        grid-template-columns: repeat(4, 25%);
        grid-template-rows: auto;
        grid-gap: 10px;
    }

    .invoice_prev{
        background-color: var(--bg-col);
        aspect-ratio: 0.80;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .invoice_number{
        font-size:var(--fs0);
    }

    .invoice_prev > div{
        padding: 1em;
        box-sizing:border-box;
    }

    .invoice_prev > div:last-of-type{
        position: absolute;
        bottom:0;
        text-align: right;
        width:100%;
    }

    .invoice_new span{
        text-align: center;
        top:50%;
        position: absolute;
        width:100%;
        transform: translateY(-50%);
    }
</style>