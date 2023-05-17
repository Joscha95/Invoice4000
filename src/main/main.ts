import {app, BrowserWindow, dialog, ipcMain, session, globalShortcut} from 'electron';
import {join} from 'path';
import PDFExporter from './classes/PDFExporter';

//const fs = require('fs');
const fs = require('fs-extra');
const path = require('path');
let rendererWindow:BrowserWindow;
let resourcesPath:string;

function createWindow():BrowserWindow {
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
  ipcMain.handle('invoices:get', handleGetInvoices);
  ipcMain.handle('invoice:export', handleExportInvoice);
  ipcMain.handle('file:get', handleGetFile);
  ipcMain.handle('fonts:get', handleGetFonts);
  ipcMain.handle('appdata:export', handleExportData);
  ipcMain.handle('appdata:import', handleImportData);
  ipcMain.handle('fonts:upload', handleUploadFonts);
  ipcMain.handle('file:save',handleSaveFile);
  ipcMain.handle('file:delete',handleDeleteFile);

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


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

async function handleSaveFile(event,data): Promise<Message> {
  try {
    fs.writeFileSync(resourcesPath + data.path, data.content, 'utf-8');
    console.log(`saved ${resourcesPath + data.path}`);
    return {type:'Success', text:'Saved File.'};
  } catch(e) {
    return createErrorMessage(e)
  }
}

async function handleDeleteFile(event, data): Promise<Message>{
  try {
    fs.unlinkSync(resourcesPath + data.path);
    console.log(`deleted ${resourcesPath + data.path}`);
    return {type:'Success', text:`deleted ${resourcesPath + data.path}`};
  } catch(e) {
    console.log(e);
    return createErrorMessage(e)
  }
}

async function handleGetFile(event,data): Promise<Message> {
  try {
    const contents = await fs.readFileSync(resourcesPath + data.path, 'utf8');
    return {type:'Success',text:'Read file '+data.path,contents:contents};
  } catch (e) {
    return createErrorMessage(e)
  }
}

async function handleGetFonts(): Promise<Message> {
  try {
    const fts:string[] = [];

    const files = await fs.promises.readdir(resourcesPath + '/fonts');
    
    files.forEach( (f:string) => {
      if(f.split('.').pop()!='ttf' && f.split('.').pop() != 'otf') return;
      
      fts.push(f);
    });
    return {type:'Success',text:'Loaded Fonts.',contents:fts};
  } catch (e) {
    console.log(e);
    return createErrorMessage(e);
  }
}

async function handleUploadFonts(): Promise<Message> {
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
      return {type:'Success',text:`${filePaths.length} font${filePaths.length==1 ? '':'s'} uploaded.`}
    } else {
      console.log("no file selected.");
      return {type:'Neutral',text:"no file selected."}
    }
  } catch (e) {
    console.log(e);
    return createErrorMessage(e)
  }
}

async function handleGetInvoices():Promise<Message> {
  try {
    const invs:any = [];

    const files = await fs.promises.readdir(resourcesPath + '/invoices');
    
    files.forEach( (f:string) => {
      if(f.split('.').pop()!='json') return;
      let r = fs.readFileSync(resourcesPath + '/invoices/'+f,'utf8');
      r = JSON.parse(r);
      invs.push(r);
    });


    return {type:'Success',text:`Loaded Invoices.`,contents:invs}
    
  } catch (e) {
    console.log(e);
    
    return createErrorMessage(e)
  }
}

async function handleExportInvoice(event, invoice):Promise<Message> {
  try {
    const exp = new PDFExporter(invoice,resourcesPath);
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    if (!canceled) {
      const p = filePaths[0];
      const name = `${invoice.json.quote ? 'A_' : 'R_'}${invoice.number}.pdf`
      exp.export(`${p}/${name}`);
      console.log(`exported invoice ${invoice.number}`);
      return {type:'Success',text:`exported ${name}`}
    } else{
      console.log("no directory selected");
      return {type:'Neutral',text:"no directory selected."};
    }
  } catch(e) {
    console.log(e);
    return createErrorMessage(e)
  }
}

async function handleExportData():Promise<Message> {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    if (!canceled) {
      const p = filePaths[0]+'/appdata';
      await fs.mkdir(p);
      await fs.copy(resourcesPath,p)
      console.log(`exported settings to ${p}`);
      return {type:'Success',text:`exported settings to ${p}`}
    } else{
      console.log("no directory selected");
      return {type:'Neutral',text:"no directory selected."};
    }
  } catch (e) {
    console.log(e);
    
    return createErrorMessage(e)
  }
}

async function handleImportData():Promise<Message> {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    if (!canceled) {
      const p = filePaths[0];
      if(!p.includes('appdata')) return {type:'Error',text:"no valid directory selected."};
      await fs.copy(p,resourcesPath)
      console.log(`imported settings from ${p}`);
      return {type:'Success',text:`imported settings from ${p}`}
    } else{
      console.log("no directory selected");
      return {type:'Neutral',text:"no directory selected."};
    }
  } catch (e) {
    console.log(e);
    
    return createErrorMessage(e)
  }
}

function createErrorMessage(e):Message{
  return {type:'Error',text:JSON.stringify(e)}
}