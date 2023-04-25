import Client from './Client'
import dayjs from 'dayjs'

class Position{
    text:string;
    sum:number;
    
    constructor(text:string = '', sum:number = 0){
        this.sum = sum;
        this.text = text;
    }
}

class Invoice{
    positions: Position[];
    client: Client;
    deleted = false;
    quote = true;
    notify: (m:Message) => void;
    getInvoiceNumber: () => string;

    number?: string;
    orderNumber: string
    date: string;
    color:string;
    taxrate:number;


    public get sum(): number{
        return this.positions.reduce((p,c) => p+c.sum, 0);
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
        this.orderNumber = orderNum;
        this.client = client;
        this.taxrate = taxrate;
        this.positions = [];
        this.notify = notify;
        this.getInvoiceNumber = getInvoiceNumber;
        this.color = `hsl(${Math.random()*360}deg 100% 50%)`;
        this.date = dayjs().format('DD.MM.YYYY');
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
      window.electron.saveFile({path:`/invoices/O_${this.orderNumber}.json`, content:this.serialize}).then( (msg:any) => {
        console.log(msg);
        msg.text = msg.type =='Error' ? msg.text : 'Saved invoice '+ this.orderNumber;
        console.log(msg);
        this.notify(msg);
      });
    }

    async delete(){
      const msg = await window.electron.deleteFile({path:`/invoices/O_${this.orderNumber}.json`});
      msg.text = msg.type =='Error' ? msg.text : 'Deleted invoice O_'+ this.orderNumber;
      this.notify(msg);
      
      if(msg.type !='Error') this.deleted = true;
      return this.deleted;
    }

    convertToInvoice(){
      this.quote = false;
      this.number = this.getInvoiceNumber();
    }

    export(){
        window.electron.exportInvoice({number:this.quote ? this.orderNumber : this.number, json:this.serialize}).then( (msg:any) => {
          this.notify(msg);
        });
    }

    load(obj:any){
        this.date = obj.date;
        this.color = obj.color || this.color;
        this.taxrate = obj.taxrate || 0;
        this.quote = obj.quote || false;
        this.orderNumber = obj.orderNumber;
        this.number = obj.number;
        obj.positions.forEach( (p:any) => this.positions.push(new Position(p.text, p.sum)))
    }

    get serialize(){
        return JSON.stringify({
            positions: this.positions,
            number : this.number,
            orderNumber: this.orderNumber,
            sum: this.sum,
            quote: this.quote,
            taxSum: this.taxSum,
            overallSum: this.overallSum,
            taxrate: this.taxrate,
            client: this.client.id,
            date: this.date,
            color:this.color,
            client_number: this.client.number,
            client_adress: this.adress
        })
    }
}

export default Invoice