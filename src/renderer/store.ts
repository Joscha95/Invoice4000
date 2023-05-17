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
    clients: Client[] = []
    protected invoices: Invoice[] = []
    protected layouts: Layout[] = []
    protected fonts: string[] = []
    protected notifications: Notification[] = []
    activeClient?: Client
    activeInvoice?: Invoice
    showInvoice: boolean
    modeBool: boolean
    overlayMode: OverlayMode
    edit: boolean
    settings: Settings

    constructor(){
      this.modeBool = false;
      this.overlayMode = 'Hide';
      this.edit = false;
      this.showInvoice = false;
      this.settings = new Settings((m:Message) =>{this.notify(m)});
    }

    get mode():Mode{
      return this.modeBool ?  'Invoices' :'Clients'
    }

    get hasClients(): boolean{
      return this.clients.length > 0;
    }

    init(){
      this.reload();

      window.electron.onMessage((_event:any,message:Message)=>{
        this.notify(message);
      });
    }

    reload(){
      window.electron.getFile({path:'/clients.json'})
      .then(res => JSON.parse(res.contents))
      .then(res => {
        if(this.notifyError(res)) return;
        this.loadClients(res);
        window.electron.getInvoices().then(res => {
          if(this.notifyError(res)) return;
          this.loadInvoices(res.contents);
        });
      });

      window.electron.getFonts().then(res => {
        if(this.notifyError(res)) return;
        this.setFonts(res.contents);
      })

      window.electron.getFile({path:'/settings.json'})
      .then(res => JSON.parse(res.contents))
      .then(res => {
        if(this.notifyError(res)) return;
        this.setSettings(res);
      })
    }
    
    setActiveInvoice(inv:Invoice){
        this.activeInvoice = inv;
        this.showInvoice = true;
    }

    loadClients(_clients:any[] ){
        _clients.forEach( (_c) => {
          this.clients.push(Object.assign(new Client(), _c));
        })
    }

    loadInvoices(_invoices:any[]){
        _invoices.forEach( (_i) => {
            const ni = new Invoice(
              _i.orderNumber,
              this.getClient(_i.client),
              undefined,
              (m:Message) =>{this.notify(m)},
              () => {return this.settings.getNextInvoiceNumber()}
              ); 
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
          //this.notify(m);
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
      this.clients.forEach(c => c.invoices = this.invoices.filter( i => i.client.id == c.id).reverse());
    }

    newQuote(client:Client){
      const num = this.settings.getNextOrderNumber();
      const inv = new Invoice(
        num, 
        client || this.clients[0],
        this.settings.taxrate,
        (m:Message) =>{this.notify(m)},
        () => {return this.settings.getNextInvoiceNumber()}
      );
        
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
      this.notifications.forEach( n => n.isFirst=false);
      this.notifications[0].isFirst = true;
    }

    notifyError(m:Message):boolean{
      if(m.type == 'Error') this.notify(m);
      return m.type == 'Error';
    }

    deleteMessage(id:string){
      this.notifications = this.notifications.filter((_m:Notification) => {return _m.id != id});
      this.notifications.forEach( n => n.isFirst=false);
      if(this.notifications[0]) this.notifications[0].isFirst = true;
    }
}

const store = reactive(new Storage())

export default store;