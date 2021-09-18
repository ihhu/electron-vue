import { pathToFileURL } from "url";
import { BrowserWindowConstructorOptions } from 'electron';
import { RENDERER_PATH } from "@main/config/index";

// 默认窗口配置
export const defaultWindowOptions: BrowserWindowConstructorOptions = {
  // titleBarStyle: "hidden",
  // frame: false,
  show: false,
  webPreferences: {
    webSecurity: false,
    devTools: true,
    nodeIntegration: true,
    contextIsolation: false,
    nativeWindowOpen:true,
  },
  backgroundColor: "#ffffff",
  maximizable: false,
  resizable: false,
  fullscreenable: true,
  fullscreen: false,
  simpleFullscreen: false,
};



let RENDERER_ORIGIN = pathToFileURL(RENDERER_PATH).toString();
if (IS_DEV) {
  let { protocol, host, port } = DEV_SERVER;
  RENDERER_ORIGIN = `${protocol}://${host}:${port}/`;
}

export { RENDERER_ORIGIN };
