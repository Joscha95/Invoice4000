import Client from './Client'
import dayjs from 'dayjs'

class Position{
    text:string;
    price:number;
    
    constructor(text:string = '', price:number = 0){
        this.price = price;
        this.text = text;
    }
}

class Invoice{
    positions: Position[]= []
    client: Client;
    deleted = false;
    quote = true;
    notify: (m:Message) => void;
    getInvoiceNumber: () => string;

    invoice_number?: string;
    order_number: string
    date: string;
    color:string;
    taxrate:number;
    unixDate:number;
    remarks:string = '';


    public get sum(): number{
        return this.positions.reduce((p,c) => p+c.price, 0);
    }

    public get taxSum(): number{
        return this.sum * (this.taxrate/100) ;
    }

    public get overallSum(): number{
        return this.sum + this.taxSum ;
    }

    public get adress():string {
        return this.client.name + '<br/>' + this.client.street + '<br/>' + this.client.zip + ' ' + this.client.city
    }

    constructor(orderNum:string, client:Client, taxrate:number = 0, notify:(m:Message) => void, getInvoiceNumber:() => string){
        this.order_number = orderNum;
        this.client = client;
        this.taxrate = taxrate;
        this.notify = notify;
        this.getInvoiceNumber = getInvoiceNumber;
        this.color = `hsl(${Math.random()*360}deg 100% 50%)`;
        this.date = dayjs().format('DD.MM.YYYY');
        this.unixDate = Date.now();
    }

    addPosition(){
        this.positions.push(new Position())
    }

    removePosition(i?:number){
      if (i) {
        this.positions.splice(i,1);
      }else{
        this.positions.pop()
      }
    }

    save(){
      window.electron.saveFile({path:`/invoices/O_${this.order_number}.json`, content:this.serialize}).then( (msg:any) => {
        msg.text = msg.type =='Error' ? msg.text : 'Saved '+ this.order_number;
        this.notify(msg);
      });
    }

    async delete(){
      const msg = await window.electron.deleteFile({path:`/invoices/O_${this.order_number}.json`});
      msg.text = msg.type =='Error' ? msg.text : 'Deleted '+ this.order_number;
      this.notify(msg);
      
      if(msg.type !='Error') this.deleted = true;
      return this.deleted;
    }

    convertToInvoice(){
      this.quote = false;
      this.invoice_number = this.getInvoiceNumber();
    }

    export(){
        window.electron.exportInvoice({number:this.quote ? this.order_number : this.invoice_number, json:this.serialize}).then( (msg:any) => {
          this.notify(msg);
        });
    }

    load(obj:any){
        this.date = obj.date;
        this.unixDate = parseInt(obj.unixDate);
        this.color = obj.color || this.color;
        this.taxrate = obj.taxrate || 0;
        this.quote = obj.quote || false;
        this.remarks = obj.remarks || '';
        this.order_number = obj.order_number;
        this.invoice_number = obj.invoice_number;
        obj.positions.forEach( (p:any) => this.positions.push(new Position(p.text, p.price)))
    }

    get serialize(){
        return JSON.stringify({
            positions: this.positions,
            invoice_number : this.invoice_number,
            order_number: this.order_number,
            sum: this.sum,
            quote: this.quote,
            taxSum: this.taxSum,
            overallSum: this.overallSum,
            taxrate: this.taxrate,
            client: this.client.id,
            date: this.date,
            unixDate: this.unixDate,
            color:this.color,
            remarks:this.remarks,
            client_number: this.client.number,
            client_adress: this.adress
        })
    }
}

export default Invoice