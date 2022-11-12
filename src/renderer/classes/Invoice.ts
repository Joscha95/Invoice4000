import Client from './Client'
import dayjs from 'dayjs'

class Position{
    text:string = '';
    sum:number = 0;

    constructor(){
    }
}

class Invoice{
    
    positions: Position[];
    client: Client;
    
    number: string;
    date: string;

    public get sum(){
        return this.positions.reduce((p,c) => p+c.sum, 0);
    }

    constructor(num:string, client:Client){
        this.number = num;
        this.client = client;
        this.positions = [];
        this.date = dayjs().format('DD.MM.YYYY')
    }

    addPosition(){
        this.positions.push(new Position())
    }

    save(){
        window.electron.ipcRenderer.send('invoice:save', {number:this.number, json:this.serialize});
    }

    export(){

    }

    get serialize(){
        return JSON.stringify({
            positions: this.positions,
            number : this.number,
            client: this.client.id,
            date: this.date
        })
    }
}

export default Invoice