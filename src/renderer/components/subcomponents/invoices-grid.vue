<template>
<div class="invoices">
    <div v-if="!hideAdd" @click="store.newQuote(client)" class="invoice_prev invoice_new" style="--bg-col:white;"> <span>+</span> </div>
    <div :class="['invoice_prev', store.edit && store.activeInvoice?.number != invoice.number ? 'inactive' : '']" 
        @dblclick="store.setActiveInvoice(invoice)" 
        v-for="invoice in invoices" 
        :key="invoice.number"
        :style="`--bg-col:${invoice.color};`">
        {{ invoice.quote ? `0_${invoice.orderNumber}` : invoice.number }}: {{ invoice.sum.toLocaleString('de-DE') }}E
    </div>
</div>
    
</template>

<script>
import Client from '../../classes/Client'
import store from '../../store'

    export default {
        data() {
            return {
                store
            }
        },
        props:{
            invoices:Array,
            client: Client,
            hideAdd: Boolean
        }
    }

</script>

<style scoped>
.invoices{
  display: grid;
  grid-template-columns: repeat(2,1fr);
  grid-gap: calc(var(--site-padding) / 2)
}

.invoice_prev{
  font-family: diatype;
  background-color: white;
  font-size: var(--fs1);
  padding: .7em .8em;
  box-sizing: border-box;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(0,0,0,.12);
  border-radius: var(--border-radius-small);
}

.invoice_new{
  text-align: center;
  color: white;
  background-color: black;
}

</style>