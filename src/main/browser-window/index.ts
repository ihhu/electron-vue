import { ipcMain, BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { RENDERER_ORIGIN, defaultWindowOptions } from "@main/browser-window/config";

class WindowCenter {
  constructor() {

  }
  init() {
    this.createMainWindow();
  }
  create(url: string, { ...options }) {

  }
  createMainWindow() { }
}

function show(win: BrowserWindow) {
  if (win.isMinimized()) {
    win.restore();
  }
  win.show();
}
function create(url: string, { id, data, ...options }: BrowserWindowConstructorOptions & { id: string, data: any }) {
  url = [RENDERER_ORIGIN, url].join("#");
  let parent = BrowserWindow.getFocusedWindow();
  let win: BrowserWindow | null = null;
  let _data = data;
  if (options.parent && parent) {
    options.parent = parent;
  }
  ipcMain.handle([id, 'init'].join(":"), () => {
    return _data;
  });

  ipcMain.handle([id, 'update'].join(":"), (event, data) => {
    _data = data;
    return true;
  });

  return new Promise((resolve, reject) => {
    win = new BrowserWindow({
      ...defaultWindowOptions,
      ...options,
    });
    win.loadURL(url);
    win.once("ready-to-show", () => {
      win && show(win);
    });
    win.on("closed", (event: Event) => {
      win = null;
      ipcMain.removeHandler([id, 'init'].join(":"))
      ipcMain.removeHandler([id, 'update'].join(":"))
      resolve({ id, data: _data });
    });
  })
}

ipcMain.handle('window:create', (event, { url, ...options }: BrowserWindowConstructorOptions & { url: string, id: string, data: any }) => {
  return create(url, options)
})

export * as main from "@main/browser-window/windows/main";