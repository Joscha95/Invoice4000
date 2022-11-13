// store.js
import { reactive } from 'vue'
import Client from './classes/Client'
import Invoice from './classes/Invoice'




class Storage {
    protected clients: Client[] = []
    protected invoices: Invoice[] = []
    activeClient: Client
    activeInvoice: Invoice
    mode: string
    edit: boolean

    constructor(){
        this.mode = 'clients';
        this.edit = false;
    }
    
    setActiveInvoice(inv:Invoice){
        if(this.mode=='clients') this.toggleMode();
        this.activeInvoice=inv;
    }

    loadClients(_clients:any[] ){
        _clients.forEach( (_c) => {
            const nc = new Client();
            nc.load(_c)
            this.clients.push(nc);
        })
    }

    loadInvoices(_invoices:any[]){
        _invoices.forEach( (_i) => {
            const ni = new Invoice(_i.number,this.getClient(_i.client));
            ni.load(_i);
            this.invoices.push(ni);
        })
    }

    newInvoice(){
        window.electron.getNextInvoiceNumber().then((num:string) => {
            const inv = new Invoice(num, this.activeClient || this.clients[0]);
            this.invoices.push(inv);
            inv.save();
            if(this.mode=='clients') this.toggleMode();
            this.activeInvoice = inv;
          });
    }

    getClient(id:string){
        const c:any = this.clients.find( c => c.id == id);
        if(!c){
            console.log(id+' client not found');
        }
        return c;
    }

    toggleMode(){
        this.mode = this.mode == 'clients' ? 'invoices' : 'clients';
        this.activeClient = undefined;
        this.activeInvoice = undefined;
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