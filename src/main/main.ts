import { app, BrowserWindow } from "electron";
import protocol from "@/main/protocol";
import { APP_CONFIG } from "@main/config/index";
import { main as mainWindow } from "@main/browser-window/index";

console.log("electron main process running.");
console.log("electron main process argvs", process.argv);


class App {
  config: typeof APP_CONFIG;
  constructor(config = APP_CONFIG) {
    this.config = config;
  }
  bindAppEvent() {
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow.create();
      }
    });
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });
  }
  async registerProtocol() {
    let config = this.config;
    protocol.setDefaultProtocol(config.protocol);
    protocol.registerSchemesAsPrivileged(config.scheme);
    await app.whenReady();
    protocol.registerFileProtocol(config.scheme);
  }
  async init() {
    this.bindAppEvent();
    this.registerProtocol();
    await app.whenReady();
    mainWindow.create();
  }
}

new App().init();

// 启用热更新
if ((module as any).hot) {
  (module as any).hot.accept();
}
