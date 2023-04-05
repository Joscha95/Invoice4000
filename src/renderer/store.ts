// store.js
import { reactive } from 'vue'
import Client from './classes/Client'
import Invoice from './classes/Invoice'
import Notification from './classes/Notification'
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
    protected notifications: Notification[] = []
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
      this.settings = new Settings((m:Message) =>{this.notify(m)});
    }

    init(){
      window.electron.getFile({path:'/clients.json'})
      .then(res => JSON.parse(res.contents))
      .then(_clients => {
        this.loadClients(_clients);
        window.electron.getInvoices().then(res => {
          this.loadInvoices(res.contents);
        });
      });

      window.electron.getFonts().then(res => {
        this.setFonts(res.contents);
      })

      window.electron.onMessage((_event:any,message:Message)=>{
        this.notify(message);
      });

      window.electron.getFile({path:'/settings.json'})
      .then(res => JSON.parse(res.contents))
      .then(res => {
        this.setSettings(res);
      })
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
            const ni = new Invoice(_i.number,this.getClient(_i.client), undefined,(m:Message) =>{this.notify(m)}); 
            ni.load(_i);
            this.invoices.push(ni);
        });
        this.updateInvoices();
    }

    setSettings(s:any){
        this.settings.load(s);
        this.settings.notify = (m:Message) =>{this.notify(m)};
    }

    setFonts(fts:string[]){
        this.fonts = fts;
    }

    refreshFonts(){
      window.electron.getFonts().then((m:Message) => {
          this.setFonts(m.contents);
          this.notify(m);
        })
    }

    async deleteActiveInvoice(){
      const res = await this.activeInvoice?.delete();
      if(res){
        this.activeInvoice = undefined;
        this.showInvoice = false;
        this.updateInvoices();
      }
    }

    updateInvoices(){
      this.invoices = this.invoices.filter((i:Invoice) => !i.deleted);
      this.clients.forEach(c => c.invoices = this.invoices.filter( i => i.client.id == c.id));
    }

    newInvoice(client:Client){
      const num = this.settings.getNextInvoiceNumber();
      const inv = new Invoice(
        this.settings.invoicenumber.toString(), 
        client || this.clients[0],
        this.settings.taxrate,
        (m:Message) =>{this.notify(m)});
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
      window.electron.saveFile({
        path:'/clients.json', 
        content:JSON.stringify(this.clients.map(c=> c.serialized()))
      }).then( (msg:Message) => {
        this.notify({type:msg.type, text: msg.type =='Error' ? msg.text : 'Saved clients.'});
      });
    }

    notify(m:Message){
      const id = makeid(5);
      this.notifications.unshift(
        new Notification(m, ()=>{this.deleteMessage(id)},id)
      );
    }

    deleteMessage(id:string){
      this.notifications = this.notifications.filter((_m:Notification) => {return _m.id != id});
    }
}

const store = reactive(new Storage())

export default store;