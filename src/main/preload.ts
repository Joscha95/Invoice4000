import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: ipcRenderer,
  getClients: () => ipcRenderer.invoke('clients:get'),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  getInvoices: () => ipcRenderer.invoke('invoices:get'),
  uploadFonts: () => ipcRenderer.invoke('fonts:upload'),
  getFonts: () => ipcRenderer.invoke('fonts:get'),
  getFile: (file:string) => ipcRenderer.invoke('files:get',file),
  saveFile: (data) => ipcRenderer.invoke('file:save', data),
  onMessage: (callback) => ipcRenderer.on('message', callback)
})
