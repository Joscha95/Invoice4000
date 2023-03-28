// store.js
import { reactive } from 'vue'
import Client from './classes/Client'
import Invoice from './classes/Invoice'
import {default as Message, messageType} from './classes/Message'
import Layout from './classes/Layout'
import Settings from './classes/Settings'
import {makeid} from './classes/Helpers'

type Mode = 'Clients' | 'Invoices';
type OverlayMode = 'Settings' | 'Help' | 'Hide';

class Storage {
    protected clients: Client[] = []
    protected invoices: Invoice[] = []
    protected layouts: Layout[] = []
    protected fonts: string[] = []
    protected messages: Message[] = []
    activeClient?: Client
    activeInvoice?: Invoice
    showInvoice: boolean
    mode: Mode
    overlayMode: OverlayMode
    edit: boolean
    settings: Settings

    constructor(){
        this.mode = 'Clients';
        this.overlayMode = 'Hide';
        this.edit = false;
        this.showInvoice = false;
        this.settings = new Settings();
    }
    
    setActiveInvoice(inv:Invoice){
        this.activeInvoice = inv;
        this.showInvoice = true;
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
            const ni = new Invoice(_i.number,this.getClient(_i.client), undefined,(_type:messageType,message:string) =>{this.notify(_type,message)}); 
            ni.load(_i);
            this.invoices.push(ni);
        });
        this.updateInvoices();
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
            this.notify('Neutral','fonts updated.')
          })
    }

    deleteActiveInvoice(){
      this.activeInvoice?.delete();
      this.activeInvoice = undefined;
      this.updateInvoices();
    }

    updateInvoices(){
      this.invoices = this.invoices.filter((i:Invoice) => !i.deleted);
      this.clients.forEach(c => c.invoices = this.invoices.filter( i => i.client.id == c.id))
    }

    newInvoice(client:Client){
      const num = this.settings.getNextInvoiceNumber();
      const inv = new Invoice(
        this.settings.invoicenumber.toString(), 
        client || this.clients[0],
        this.settings.taxrate,
        (_type:messageType,message:string) =>{this.notify(_type,message)});
      this.invoices.push(inv);
      inv.save();
      this.activeInvoice = inv;
      this.updateInvoices();
    }

    getClient(id:string){
        const c:any = this.clients.find( c => c.id == id);
        if(!c){
            console.log(id+' client not found');
        }
        return c;
    }

    saveClients(){
      window.electron.ipcRenderer.send('clients:save', JSON.stringify(this.clients.map(c=> c.serialized())));
    }

    notify(type:messageType,message:string){
      const id = makeid(5);
      this.messages.unshift(
        new Message(message,()=>{this.deleteMessage(id)},type,id)
      );
    }

    deleteMessage(id:string){
      this.messages = this.messages.filter((_m:Message) => {return _m.id != id});
    }
}

const store = reactive(new Storage())

export default store;