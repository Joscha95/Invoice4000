import {app, BrowserWindow, dialog, ipcMain, session, globalShortcut} from 'electron';
import {join} from 'path';
import dayjs from 'dayjs';
import PDFExporter from './classes/PDFExporter';
import { file } from 'pdfkit';
const fs = require('fs');
const path = require('path');


function createWindow () {
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

  mainWindow.webContents.openDevTools()

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
  }
}

app.whenReady().then(() => {
  ipcMain.handle('clients:get', handleGetClients);
  ipcMain.handle('invoices:get', handleGetInvoices);
  ipcMain.handle('layouts:get', handleGetLayouts);
  ipcMain.handle('fonts:get', handleGetFonts);
  ipcMain.handle('fonts:upload', handleUploadFonts);
  ipcMain.handle('invoices:getNextInvoiceNumber', handleGetNextInvoiceNumber);
  

  createWindow();

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
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('message', (event, message) => {
  console.log(message);
})

ipcMain.on('clients:save',(event, data)=>{
  try {
    fs.writeFileSync('./appdata/clients.json', data, 'utf-8');
    console.log('saved clients');
  } catch(e) {
    console.log(e)
  }
});

ipcMain.on('invoice:save',(event, invoice)=>{
  try {
    fs.writeFileSync(`./appdata/invoices/R_${invoice.number}.json`, invoice.json, 'utf-8');
    console.log(`saved invoice ${invoice.number}`);
  } catch(e) {
    console.log(e)
  }
});

ipcMain.on('invoice:export',(event, invoice)=>{
  try {
    const exp = new PDFExporter(invoice);
    exp.export(`./appdata/invoices/R_${invoice.number}.pdf`);
    console.log(`exported invoice ${invoice.number}`);
  } catch(e) {
    console.log(e)
  }
});

async function handleGetClients() {
  try {
    const data = await fs.readFileSync('./appdata/clients.json', 'utf8');
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function handleGetFonts() {
  try {
    const fts:string[] = [];

    const files = await fs.promises.readdir('./appdata/fonts');
    
    files.forEach( (f:string) => {
      if(f.split('.').pop()!='ttf' && f.split('.').pop() != 'otf') return;
      console.log(f);
      
      fts.push(f);
    });
    return JSON.stringify(fts);
  } catch (error) {
    console.log(error);
  }
}

async function handleUploadFonts() {
  try {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: "Fonts", extensions: ["ttf", "otf"] },
      ] 
    }).then(response => {
      if (!response.canceled) {
        // handle fully qualified file name
        console.log(response.filePaths[0]);
        response.filePaths.forEach(file => {
          const name = path.basename(file);
          fs.copyFile(file, './appdata/fonts/'+name, (err) => {
            if (err) throw err;
            console.log('copied: ' + name);
          });
        });
      } else {
        console.log("no file selected");
      }
    })
  } catch (error) {
    console.log(error);
  }
}

async function handleGetLayouts() {
  try {
    const files = fs.readdirSync('./appdata/layouts', { withFileTypes: true })
    .filter((item) => item.isDirectory());
    const data:any[] = [];
    
    files.forEach( (f) => {
      if(!f.isDirectory()) return;
      let r = fs.readFileSync('./appdata/layouts/'+f.name+'/layout.json','utf8');
      r = JSON.parse(r);
      data.push(r);
    });

    return JSON.stringify(data);
  } catch (error) {
    console.log(error);
  }
}

async function handleGetNextInvoiceNumber(){
  try {
    let data = await fs.readFileSync('./appdata/invoice_number.txt', 'utf8');
    
    let num = data.substring(2);
    num = parseInt(num);
    num++;

    const oldY = data.substring(0,2);
    const y = dayjs().format('YY');
    if(y != oldY) num = 0;
    data = y+('00'+num).slice(-3);

    fs.writeFileSync('./appdata/invoice_number.txt', data ,'utf8');
    return data;

  } catch (error) {
    console.log(error);
  }
}

async function handleGetInvoices() {
  try {
    const invs:any = [];

    const files = await fs.promises.readdir('./appdata/invoices');
    
    files.forEach( (f:string) => {
      if(f.split('.').pop()!='json') return;
      let r = fs.readFileSync('./appdata/invoices/'+f,'utf8');
      r = JSON.parse(r);
      invs.push(r);
    });

    return invs;
    
  } catch (error) {
    console.log(error);
  }
}