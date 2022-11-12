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
    mode: string
    edit: boolean

    constructor(){
        this.mode = 'clients';
        this.edit = false;
    }
    
    setActiveInvoice(inv:Invoice){
        this.activeInvoice=inv;
    }

    loadClients(_clients:Client[] ){
        _clients.forEach( (_c) => {
            const nc = new Client();
            nc.load(_c)
            this.clients.push(nc);
        })
    }

    newInvoice(){
        window.electron.getNextInvoiceNumber().then((num:string) => {
            const inv = new Invoice(num, this.clients[0]);
            this.invoices.push(inv);
          });
    }

    toggleMode(){
        this.mode = this.mode == 'clients' ? 'invoices' : 'clients';
    }

    toggleEdit(){
        this.edit = !this.edit;
        if(!this.edit){
            if(this.mode == 'clients' && this.activeClient){
                window.electron.ipcRenderer.send('clients:save', JSON.stringify(this.clients));
            } else if(this.mode == 'invoices' && this.activeInvoice){
                this.activeInvoice.save();
            }
        }
    }
}

const store = reactive(new Storage())

export default store;