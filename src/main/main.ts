import path from "path";
import { pathToFileURL } from "url";
import { app, BrowserWindow } from "electron"



console.log("electron main process running.")
console.log("electron main process argvs",process.argv);

const RENDERER_PATH = "./resources/app.asar/renderer/";
let urlOrigin =  pathToFileURL(path.join(process.cwd(),RENDERER_PATH)).toString();

if(IS_DEV){
    urlOrigin = `${DEV_SERVER.protocol}://${DEV_SERVER.host}:${DEV_SERVER.port}/`
    console.log("electron main process devServer",urlOrigin,new URL("./",urlOrigin).toString())
}

function createWindow () {
    const win = new BrowserWindow({
        width:800,
        height: 600,
        minWidth :800,
        minHeight : 600,
        // frame : false,
        webPreferences : {
            nodeIntegration: true,
            enableRemoteModule : true,
            webSecurity :false
        }
    })
    win.loadURL(new URL("./index.html",urlOrigin).toString())
}



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
// app.whenReady().then(createWindow)
app.on('ready', () => {
    createWindow()
})
  
// 启用热更新
if((module as any).hot){
    (module as any).hot.accept()
}