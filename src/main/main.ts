import {app, BrowserWindow, dialog, ipcMain, session, globalShortcut} from 'electron';
import {join} from 'path';

import PDFExporter from './classes/PDFExporter';
import { file } from 'pdfkit';
const fs = require('fs');
const path = require('path');
let rendererWindow:BrowserWindow;
let resourcesPath:string;

function createWindow ():BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    x:2200,
    y:500,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  //mainWindow.webContents.openDevTools()

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
    resourcesPath = './appdata_dev';
  }
  else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    resourcesPath = process.resourcesPath + '/appdata';
  }

  return mainWindow;
}

app.whenReady().then(() => {
  ipcMain.handle('clients:get', handleGetClients);
  ipcMain.handle('settings:get', handleGetSettings);
  ipcMain.handle('invoices:get', handleGetInvoices);
  ipcMain.handle('files:get', handleGetFile);
  ipcMain.handle('fonts:get', handleGetFonts);
  ipcMain.handle('fonts:upload', handleUploadFonts);
  ipcMain.handle('file:save',handleSaveFile);

  rendererWindow = createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['script-src \'self\'']
      }
    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      rendererWindow = createWindow();
    }
  });
});

// rendererWindow.webContents.send('update-counter', 1)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('message', (event, message) => {
  console.log(message);
})

ipcMain.on('clients:save',(event, data)=>{
  try {
    fs.writeFileSync(resourcesPath + '/clients.json', data, 'utf-8');
    console.log('saved clients');
    rendererWindow.webContents.send('message', {type:'Neutral',message:'Saved clients.'})
  } catch(e) {
    console.log(e)
    rendererWindow.webContents.send('message', {type:'Error',message:e})
  }
});

async function handleSaveFile(event,data) {
  try {
    fs.writeFileSync(resourcesPath + data.path, data.content, 'utf-8');
    console.log(`saved ${resourcesPath + data.path}`);
    return {type:'Success', message:'Saved File.'};
  } catch(e) {
    return {type:'Error',message:e};
  }
}

ipcMain.on('files:delete',(event, data)=>{
  try {
    fs.unlinkSync(resourcesPath + data.path);
    console.log(`deleted ${resourcesPath + data.path}`);
  } catch(e) {
    console.log(e);
    rendererWindow.webContents.send('message', {type:'Error',message:e})
  }
});

ipcMain.on('invoice:export',(event, invoice)=>{
  try {
    const exp = new PDFExporter(invoice,resourcesPath);
      dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then(response => {
      if (!response.canceled) {
        const p = response.filePaths[0];
        console.log(p);
        exp.export(`${p}/R_${invoice.number}.pdf`);
        console.log(`exported invoice ${invoice.number}`);
        rendererWindow.webContents.send('message', {type:'Success',message:`exported invoice ${invoice.number}.`})
      } else {
        console.log("no directory selected");
        rendererWindow.webContents.send('message', {type:'Neutral',message:"no directory selected."})
      }
      
    });
    
  } catch(e) {
    console.log(e)
    rendererWindow.webContents.send('message', {type:'Error',message:e})
  }
});

async function handleGetClients() {
  try {
    const data = await fs.readFileSync(resourcesPath + '/clients.json', 'utf8');
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function handleGetSettings() {
  try {
    const data = await fs.readFileSync(resourcesPath + '/settings.json', 'utf8');
    return data;
  } catch (error) {
    console.log(error);
    rendererWindow.webContents.send('message', {type:'Error',message:error})
  }
}

async function handleGetFonts() {
  try {
    const fts:string[] = [];

    const files = await fs.promises.readdir(resourcesPath + '/fonts');
    
    files.forEach( (f:string) => {
      if(f.split('.').pop()!='ttf' && f.split('.').pop() != 'otf') return;
      
      fts.push(f);
    });
    return JSON.stringify(fts);
  } catch (error) {
    console.log(error);
    rendererWindow.webContents.send('message', {type:'Error',message:error})
  }
}

async function handleUploadFonts() {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: "Fonts", extensions: ["ttf", "otf"] },
      ] 
    })
    if (!canceled) {
      // handle fully qualified file name
      console.log(filePaths[0]);
      filePaths.forEach(file => {
        const name = path.basename(file);
        fs.copyFile(file, resourcesPath + '/fonts/'+name, (err) => {
          if (err) throw err;
          console.log('copied: ' + name);
        });
      });
      return `${filePaths.length} font${filePaths.length==1 ? '':'s'} uploaded.`
    } else {
      console.log("no file selected.");
      return "no file selected.";
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function handleGetFile(event,file:string) {
  try {
    const data = await fs.readFileSync(file, 'utf8');
    console.log(file);
    
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function handleGetInvoices() {
  try {
    const invs:any = [];

    const files = await fs.promises.readdir(resourcesPath + '/invoices');
    
    files.forEach( (f:string) => {
      if(f.split('.').pop()!='json') return;
      let r = fs.readFileSync(resourcesPath + '/invoices/'+f,'utf8');
      r = JSON.parse(r);
      invs.push(r);
    });

    return invs;
    
  } catch (error) {
    console.log(error);
  }
}