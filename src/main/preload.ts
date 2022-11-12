import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: ipcRenderer,
  getClients: () => ipcRenderer.invoke('clients:get'),
  getInvoices: () => ipcRenderer.invoke('invoices:get'),
  getNextInvoiceNumber: () => ipcRenderer.invoke('invoices:getNextInvoiceNumber')
})
