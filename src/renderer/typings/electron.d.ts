import * as Electron from 'electron';

/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  ipcRenderer: Electron.IpcRenderer,
  getInvoices() : any,
  exportInvoice() : void,
  uploadFonts() : void,
  getFonts() : Promise<string>,
  getFile() : void,
  saveFile(d:any) : Promise<any>,
  deleteFile() : void,
  onMessage() : void,
}

declare global {
  interface Window {
    electron: ElectronApi,
  }
}
