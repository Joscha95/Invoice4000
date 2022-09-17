// store.js
import { reactive } from 'vue'

export const store = reactive({
    clients:[],
    invoices:[],
    selectedClient:null,
    activeClient:null,
})
