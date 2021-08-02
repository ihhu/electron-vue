import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { RENDERER_ORIGIN, defaultWindowOptions } from "@main/browser-window/config";
console.log("LLL:: ~ file: main.ts ~ line 3 ~ RENDERER_ORIGIN", RENDERER_ORIGIN);

let win: BrowserWindow | null = null;

const windowConfig = {
  width: 800,
  height: 600
}

function create(options: BrowserWindowConstructorOptions = windowConfig) {
  let url = new URL("/index.html", RENDERER_ORIGIN).toString()
  win = new BrowserWindow({
    ...defaultWindowOptions,
    ...options
  });

  win.loadURL(url);
  win.once("ready-to-show", () => {
    show();
  });
  win?.on("closed", (event: Event) => {
    win = null;
  });

}
function send(channel: string, ...args: any[]) {
  win?.webContents?.send(channel, ...args);
}
function show() {
  if (win?.isMinimized()) {
    win?.restore();
  }
  win?.show();
}
function hide() {
  win?.hide();
}
function close() {
  win?.close();

}
function getBrowserWindow() {
  return win;
}

export {
  win,
  create,
  send,
  show,
  hide,
  close,
  getBrowserWindow
}