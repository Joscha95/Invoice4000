import {makeid} from './Helpers'
import Invoice from './Invoice';

class Client{
    name = 'name';
    short = 'handle';
    number = '';
    street = 'street';
    city = 'city';
    zip = 'zip';
    mail = 'mail';
    phone = 'phone';
    contact = 'contact';
    id: string;
    invoices: Array<Invoice> = []

    constructor(num:string = '000' ){
        this.number = num;
        this.id = `c_${Date.now()}`;
    }

    load(obj:any){
        this.name = obj.name;
        this.short = obj.short;
        this.number = obj.number;
        this.street = obj.street;
        this.city = obj.city;
        this.zip = obj.zip;
        this.mail = obj.mail;
        this.phone = obj.phone;
        this.contact = obj.contact;
        this.id = obj.id || `c_${makeid(5)}${obj.short}`;
    }

    serialized(){
      return{
        name : this.name,
        short : this.short,
        number : this.number,
        street : this.street,
        city : this.city,
        zip : this.zip,
        mail : this.mail,
        phone : this.phone,
        contact : this.contact,
        id: this.id
      }
    }

}

export default Client