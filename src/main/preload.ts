import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: ipcRenderer,
  getClients: () => ipcRenderer.invoke('clients:get'),
  getInvoices: () => ipcRenderer.invoke('invoices:get'),
  getLayouts: () => ipcRenderer.invoke('layouts:get'),
  uploadFonts: () => ipcRenderer.invoke('fonts:upload'),
  getFonts: () => ipcRenderer.invoke('fonts:get'),
  getNextInvoiceNumber: () => ipcRenderer.invoke('invoices:getNextInvoiceNumber')
})
