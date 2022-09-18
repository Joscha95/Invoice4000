// store.js
import { reactive } from 'vue'
import Client from './classes/Client'
import Invoice from './classes/Invoice'




class Storage {
    protected clients: Client[] = []
    protected invoices: Invoice[] = []
    selectedClient: Client
    activeClient: Client
    activeInvoice: Invoice

    constructor(){

    }
    
    setActiveInvoice(inv:Invoice){
        this.activeInvoice=inv;
    }

    setClients(_clients:Array<Client> ){
        this.clients = _clients;
    }

    addInvoice(inv:Invoice){
        this.invoices.push(inv);
    }
}

const store = reactive(new Storage())

export default store;