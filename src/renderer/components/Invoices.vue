<template>
<invoices-grid :invoices="store.invoices"></invoices-grid>
    
</template>

<script>
    import store from '../store'
    import invoicesGrid from './subcomponents/invoices-grid.vue' 

    export default {
        data() {
            return {
                store
            }
        },
        components: { invoicesGrid },
    }
</script>

<style scoped>
    .invoices{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: auto;
        grid-gap: 10px;
    }

    .invoice_prev{
        background-color: var(--bg-col);
        aspect-ratio: 0.80;
        cursor: pointer;
        position: relative;
        
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