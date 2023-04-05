import * as Electron from 'electron';

/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  ipcRenderer: Electron.IpcRenderer,
  getInvoices() : Promise<Message>,
  exportInvoice(d:any) : Promise<Message>,
  uploadFonts() : Promise<Message>,
  getFonts() : Promise<Message>,
  getFile(d:any) : Promise<Message>,
  saveFile(d:any) : Promise<Message>,
  deleteFile(d:any) : Promise<Message>,
  onMessage(f:Function) : void,
}

declare global {
  interface Window {
    electron: ElectronApi,
  }
}
