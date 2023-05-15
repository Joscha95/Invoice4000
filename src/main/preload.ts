import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: ipcRenderer,
  getInvoices: () => ipcRenderer.invoke('invoices:get'),
  exportInvoice: (invoice) => ipcRenderer.invoke('invoice:export',invoice),
  uploadFonts: () => ipcRenderer.invoke('fonts:upload'),
  getFonts: () => ipcRenderer.invoke('fonts:get'),
  getFile: (data) => ipcRenderer.invoke('file:get',data),
  saveFile: (data) => ipcRenderer.invoke('file:save', data),
  deleteFile: (data) => ipcRenderer.invoke('file:delete', data),
  onMessage: (callback) => ipcRenderer.on('message', callback),
  exportAppData:()=>ipcRenderer.invoke('appdata:export')
})
