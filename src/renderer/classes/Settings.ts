import FigmaFile from './FigmaFile'
import dayjs from 'dayjs'

class Settings {
  figmaFileId:string
  figmaAccessToken:string
  figmaFile: FigmaFile
  taxrate: number
  invoicenumber:string

  constructor(d?:any){
    this.figmaFileId = d?.figmaFileId || '' ;
    this.figmaAccessToken = d?.figmaAccessToken || '';
    this.taxrate = d?.taxrate || 0;
    this.invoicenumber = d?.invoicenumber;
    this.figmaFile = new FigmaFile();
  }

  save(){
    window.electron.ipcRenderer.send('files:save', {path:`./appdata/settings.json`,content:JSON.stringify(this)});
  }

  load(d:any){
    this.figmaFileId = d.figmaFileId;
    this.figmaAccessToken = d.figmaAccessToken;
    this.taxrate = d.taxrate;
    this.invoicenumber = d.invoicenumber;
    this.figmaFile.load(d.figmaFile);
  }

  getNextInvoiceNumber(){
    let invstr = this.invoicenumber.toString()
    let strnum = invstr.substring(2);
    let num = parseInt(strnum);
    num++;

    const oldY = invstr.substring(0,2);
    const y = dayjs().format('YY');
    if(y != oldY) num = 0;
    this.invoicenumber = y+('00'+num).slice(-3);
    this.save();
    return this.invoicenumber;
  }
}

export default Settings