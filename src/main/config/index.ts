import { app } from "electron";
import path from 'path';

export const APP_PATH = app.getAppPath(); // app.getAppPath() resources/app.asar/
export const MAIN_PATH = path.join(APP_PATH, 'main/');
export const RENDERER_PATH = path.join(APP_PATH, 'renderer/');

export const APP_CONFIG = {
  scheme: "electron",
  protocol: "electron"
}