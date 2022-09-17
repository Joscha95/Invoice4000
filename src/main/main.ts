import {app, BrowserWindow, ipcMain, session} from 'electron';
import {join} from 'path';
const fs = require('fs');

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
  ipcMain.handle('clients:get', handleGetClients)
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

ipcMain.on('saveClients',(event, data)=>{
  try {
    fs.writeFileSync('./appdata/clients.json', data, 'utf-8');
    console.log('saved');
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