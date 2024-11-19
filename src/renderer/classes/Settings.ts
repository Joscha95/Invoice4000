import store from '../store'
import FigmaFile from './FigmaFile'
import dayjs from 'dayjs'

export type settings = {
  figmaFileId:string
  figmaAccessToken:string
  figmaFile: FigmaFile
  taxrate: number
  invoiceNumber:number
  lastSavedInvoiceYear:string
  orderNumber: number
  lastSavedOrderYear: string
}

export default class Settings {
  figmaFileId: string
  figmaAccessToken: string
  figmaFile: FigmaFile
  taxrate: number
  invoiceNumber:number
  lastSavedInvoiceYear: string
  orderNumber: number
  lastSavedOrderYear: string

  constructor(d?:any){
    this.figmaFileId = d?.figmaFileId || '' ;
    this.figmaAccessToken = d?.figmaAccessToken || '';
    this.taxrate = d?.taxrate || 0;
    this.invoiceNumber = d?.invoiceNumber;
    this.lastSavedInvoiceYear = d?.lastSavedInvoiceYear;
    this.orderNumber = d?.orderNumber;
    this.lastSavedOrderYear = d?.lastSavedOrderYear;
    this.figmaFile = new FigmaFile();
  }

  get serialized(){
    return {
      figmaFileId: this.figmaFileId,
      figmaAccessToken: this.figmaAccessToken,
      taxrate: this.taxrate,
      invoiceNumber: this.invoiceNumber,
      lastSavedInvoiceYear: this.lastSavedInvoiceYear,
      orderNumber: this.orderNumber,
      lastSavedOrderYear: this.lastSavedOrderYear,
      figmaFile: this.figmaFile.serialized,
    }
  }

  save(){
    window.electron.saveFile({path:`/settings.json`,content:JSON.stringify(this.serialized)})
    .then((msg:Message) => {
      
      store.notify({type:msg.type, text:msg.type =='Error' ? msg.text : 'Updated settings.'});
      
    });
    console.log('save');
    
  }

  load(d:settings){
    this.figmaFileId = d.figmaFileId;
    this.figmaAccessToken = d.figmaAccessToken;
    this.taxrate = d.taxrate;
    this.lastSavedInvoiceYear = d.lastSavedInvoiceYear;
    this.lastSavedOrderYear = d.lastSavedOrderYear;
    this.invoiceNumber = d.invoiceNumber;
    this.orderNumber = d.orderNumber;
    this.figmaFile.load(d.figmaFile);
  }

  getNextOrderNumber(){
    this.orderNumber++;
    const y = dayjs().format('YY');
    if(this.lastSavedOrderYear != y) this.orderNumber = 0;
    this.lastSavedOrderYear = y;
    this.save();

    return y+('00'+this.orderNumber).slice(-3);
  }

  getNextInvoiceNumber():string{
    this.invoiceNumber++;
    const y = dayjs().format('YY');
    if(this.lastSavedInvoiceYear != y) this.invoiceNumber = 0;
    this.lastSavedInvoiceYear = y;
    this.save();

    return y+('00'+this.invoiceNumber).slice(-3);
  }

}