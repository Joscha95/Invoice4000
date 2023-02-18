// store.js
import { reactive } from 'vue'
import Client from './classes/Client'
import Invoice from './classes/Invoice'
import Layout from './classes/Layout'
import Settings from './classes/Settings'

type Mode = 'Clients' | 'Invoices' | 'Settings';

class Storage {
    protected clients: Client[] = []
    protected invoices: Invoice[] = []
    protected layouts: Layout[] = []
    protected fonts: string[] = []
    activeClient?: Client
    activeInvoice?: Invoice
    mode: Mode
    edit: boolean
    settings: Settings

    constructor(){
        this.mode = 'Clients';
        this.edit = false;
        this.settings = new Settings();
    }
    
    setActiveInvoice(inv:Invoice){
        if(this.mode=='Clients') this.toggleMode();
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
        });
        this.clients.forEach(c => c.invoices = this.invoices.filter( i => i.client.id == c.id))
    }

    setSettings(s:any){
        this.settings.load(s);
    }

    setFonts(fts:string[]){
        this.fonts = fts;
    }

    refreshFonts(){
        window.electron.getFonts().then((res:string) => JSON.parse(res)).then((res:any) => {
            this.setFonts(res);
          })
    }

    newInvoice(client:Client){
        window.electron.getNextInvoiceNumber().then((num:string) => {
            const inv = new Invoice(num, client || this.clients[0]);
            this.invoices.push(inv);
            inv.save();
            if(this.mode=='Clients') this.toggleMode();
            this.activeInvoice = inv;
          });
          this.clients.forEach(c => c.invoices = this.invoices.filter( i => i.client.id == c.id))
    }

    getClient(id:string){
        const c:any = this.clients.find( c => c.id == id);
        if(!c){
            console.log(id+' client not found');
        }
        return c;
    }

    toggleMode(){
        this.mode = this.mode == 'Clients' ? 'Invoices' : 'Clients';
        this.activeClient = undefined;
        this.activeInvoice = undefined;
    }

    saveClients(){
      window.electron.ipcRenderer.send('clients:save', JSON.stringify(this.clients.map(c=> c.invoices=[])));
    }
}

const store = reactive(new Storage())

export default store;