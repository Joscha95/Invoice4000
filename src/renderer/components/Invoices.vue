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
    }
</style>