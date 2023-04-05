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
    invoices: Array<Invoice> = [];
    expanded = false;

    constructor(num:string = '000'){
        this.number = num;
        this.id = `c_${Date.now()}`;
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