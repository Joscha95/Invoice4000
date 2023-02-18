import FigmaFile from './FigmaFile'

class Settings {
  figmaFileId:string
  figmaAccessToken:string
  figmaFile: FigmaFile

  constructor(d?:any){
    this.figmaFileId = d?.figmaFileId || '' ;
    this.figmaAccessToken = d?.figmaAccessToken || '';
    this.figmaFile = new FigmaFile();
  }

  save(){
    window.electron.ipcRenderer.send('files:save', {path:`./appdata/settings.json`,content:JSON.stringify(this)});
  }

  load(d:any){
    this.figmaFileId = d.figmaFileId;
    this.figmaAccessToken = d.figmaAccessToken;
    this.figmaFile.load(d.figmaFile);
  }
}

export default Settings