import Client from './Client'
import dayjs from 'dayjs'

class Position{
    text:string;
    sum:number;

    constructor(text:string = '', sum:number = 0){
        this.sum=sum;
        this.text=text;
    }
}

class Invoice{
    
    positions: Position[];
    client: Client;
    
    number: string;
    date: string;
    color:string;

    public get sum(){
        return this.positions.reduce((p,c) => p+c.sum, 0);
    }

    constructor(num:string, client:Client){
        this.number = num;
        this.client = client;
        this.positions = [];
        this.color = `hsl(${Math.random()*360}deg 100% 50%)`;
        this.date = dayjs().format('DD.MM.YYYY');
    }

    addPosition(){
        this.positions.push(new Position())
    }

    save(){
        window.electron.ipcRenderer.send('invoice:save', {number:this.number, json:this.serialize});
        this.export();
    }

    export(){
        window.electron.ipcRenderer.send('invoice:export', {number:this.number, json:this.serialize});
    }

    load(obj:any){
        this.date = obj.date;
        this.color = obj.color || this.color;
        obj.positions.forEach( (p:any) => this.positions.push(new Position(p.text, p.sum)))
    }

    get serialize(){
        return JSON.stringify({
            positions: this.positions,
            number : this.number,
            client: this.client.id,
            date: this.date,
            color:this.color
        })
    }
}

export default Invoice