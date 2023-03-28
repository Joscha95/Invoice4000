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
    notify:Function;

    number: string;
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

    constructor(num:string, client:Client, taxrate:number = 0,notify:Function){
        this.number = num;
        this.client = client;
        this.taxrate = taxrate;
        this.positions = [];
        this.notify = notify;
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
      window.electron.saveFile({path:`/invoices/R_${this.number}.json`, content:this.serialize}).then( (msg:any) => {
        this.notify(msg.type, msg.type =='Error' ? msg.message : 'Saved invoice '+ this.number);
      });
    }

    delete(){
      window.electron.ipcRenderer.send('files:delete', {path:`/invoices/R_${this.number}.json`});
      this.deleted = true;
    }

    export(){
        window.electron.ipcRenderer.send('invoice:export', {number:this.number, json:this.serialize});
    }

    load(obj:any){
        this.date = obj.date;
        this.color = obj.color || this.color;
        this.taxrate = obj.taxrate || 0;
        obj.positions.forEach( (p:any) => this.positions.push(new Position(p.text, p.sum)))
    }

    get serialize(){
        return JSON.stringify({
            positions: this.positions,
            number : this.number,
            sum: this.sum,
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