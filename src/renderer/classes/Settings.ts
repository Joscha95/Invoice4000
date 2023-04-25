import FigmaFile from './FigmaFile'
import dayjs from 'dayjs'

class Settings {
  figmaFileId:string
  figmaAccessToken:string
  figmaFile: FigmaFile
  taxrate: number
  invoiceNumber:number
  lastSavedInvoiceYear:string
  orderNumber: number
  lastSavedOrderYear: string
  notify:(m:Message)=> void

  constructor(d?:any){
    this.figmaFileId = d?.figmaFileId || '' ;
    this.figmaAccessToken = d?.figmaAccessToken || '';
    this.taxrate = d?.taxrate || 0;
    this.invoiceNumber = d?.invoiceNumber;
    this.lastSavedInvoiceYear = d?.lastSavedInvoiceYear;
    this.orderNumber = d?.orderNumber;
    this.lastSavedOrderYear = d?.lastSavedOrderYear;
    this.figmaFile = new FigmaFile();
    this.notify = () => {};
  }

  save(){
    window.electron.saveFile({path:`/settings.json`,content:JSON.stringify(this)})
    .then((msg:Message) => {
      this.notify({type:msg.type, text:msg.type =='Error' ? msg.text : 'Updated settings.'});
    });
  }

  load(d:any){
    this.figmaFileId = d.figmaFileId;
    this.figmaAccessToken = d.figmaAccessToken;
    this.taxrate = d.taxrate;
    this.lastSavedInvoiceYear = d.lastSavedInvoiceYear;
    this.lastSavedOrderYear = d.lastSavedOrderYear;
    this.invoiceNumber = parseInt(d.invoiceNumber);
    this.orderNumber = parseInt(d.orderNumber);
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

export default Settings