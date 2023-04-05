import FigmaFile from './FigmaFile'
import dayjs from 'dayjs'

class Settings {
  figmaFileId:string
  figmaAccessToken:string
  figmaFile: FigmaFile
  taxrate: number
  invoicenumber:number
  lastSavedInvoiceYear:string
  notify:(m:Message)=>void

  constructor(d?:any){
    this.figmaFileId = d?.figmaFileId || '' ;
    this.figmaAccessToken = d?.figmaAccessToken || '';
    this.taxrate = d?.taxrate || 0;
    this.invoicenumber = d?.invoicenumber;
    this.lastSavedInvoiceYear = d?.lastSavedInvoiceYear;
    this.figmaFile = new FigmaFile();
    this.notify = () => {};
  }

  save(){
    window.electron.saveFile({path:`/settings.json`,content:JSON.stringify(this)})
    .then((msg:any) => {
      this.notify({type:msg.type, text:msg.type =='Error' ? msg.text : 'Updated settings.'});
    });
  }

  load(d:any){
    this.figmaFileId = d.figmaFileId;
    this.figmaAccessToken = d.figmaAccessToken;
    this.taxrate = d.taxrate;
    this.lastSavedInvoiceYear = d.lastSavedInvoiceYear;
    this.invoicenumber = parseInt(d.invoicenumber);
    this.figmaFile.load(d.figmaFile);
  }

  getNextInvoiceNumber():string{
    // let invstr = this.invoicenumber.toString()
    // let strnum = invstr.substring(2);
    // let num = parseInt(strnum);
    // num++;

    // const oldY = invstr.substring(0,2);
    // const y = dayjs().format('YY');
    // if(y != oldY) num = 0;
    // this.invoicenumber = y+('00'+num).slice(-3);
    // this.save();
    this.invoicenumber++;
    const y = dayjs().format('YY');
    if(this.lastSavedInvoiceYear != y) this.invoicenumber = 0;
    this.lastSavedInvoiceYear = y;
    this.save();

    return y+('00'+this.invoicenumber).slice(-3);
  }

}

export default Settings