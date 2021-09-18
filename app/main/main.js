/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("electron");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _main_dialog_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _main_config_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5);
// 自定义协议




const PROTOCOL_URL = "electron"; // 自定义协议的链接 正则

const DEFAULT_PROTOCOL_REGEXP = new RegExp(`^${PROTOCOL_URL}://`); // 设置自定义协议

function setDefaultProtocol(protocol) {
  let isSuccess = false;

  if (!protocol) {
    return [isSuccess, null];
  }

  if (electron__WEBPACK_IMPORTED_MODULE_1__.app.isDefaultProtocolClient(protocol)) {
    return [true, () => {
      // 每次运行删除 这样就可以重新注册了
      electron__WEBPACK_IMPORTED_MODULE_1__.app.removeAsDefaultProtocolClient(protocol);
    }];
  } // 每次运行删除 这样就可以重新注册了


  electron__WEBPACK_IMPORTED_MODULE_1__.app.removeAsDefaultProtocolClient(protocol); // 开发模式下在window运行需要做兼容

  if (process.env.NODE_ENV === "development" && process.platform === "win32") {
    // 设置electron.exe 和 app的路径
    isSuccess = electron__WEBPACK_IMPORTED_MODULE_1__.app.setAsDefaultProtocolClient(protocol, process.execPath, [path__WEBPACK_IMPORTED_MODULE_0___default().resolve(process.argv[1])]);
  } else {
    isSuccess = electron__WEBPACK_IMPORTED_MODULE_1__.app.setAsDefaultProtocolClient(protocol);
  }

  return [isSuccess, () => {
    // 每次运行删除 这样就可以重新注册了
    electron__WEBPACK_IMPORTED_MODULE_1__.app.removeAsDefaultProtocolClient(protocol);
  }];
} // 监听mac下自定义协议打开


function watchMacProtocol() {
  // mac会激活open-url事件
  electron__WEBPACK_IMPORTED_MODULE_1__.app.on("open-url", (event, url) => {
    // electron-playground://asdsadsaddsfd
    const isProtocol = DEFAULT_PROTOCOL_REGEXP.test(url);

    if (isProtocol) {
      _main_dialog_index__WEBPACK_IMPORTED_MODULE_2__.messageBox.info({
        message: "Mac protocol 自定义协议打开",
        detail: `链接:${url}`
      });
    }
  });
} // 监听window下 自定义协议打开


function watchWindowProtocol() {
  electron__WEBPACK_IMPORTED_MODULE_1__.app.on("second-instance", (event, commandLine) => {
    commandLine.forEach(str => {
      if (DEFAULT_PROTOCOL_REGEXP.test(str)) {
        _main_dialog_index__WEBPACK_IMPORTED_MODULE_2__.messageBox.info({
          message: "window protocol 自定义协议打开",
          detail: `链接:${str}`
        });
      }
    });
  });
} // 需要再ready事件前调用, 并且只调用一次


function registerSchemesAsPrivileged(scheme) {
  return electron__WEBPACK_IMPORTED_MODULE_1__.protocol.registerSchemesAsPrivileged([{
    scheme,
    privileges: {
      bypassCSP: true
    }
  }]);
} // 请求文件自定义协议拦截 重新设置请求链接


function registerFileProtocol(scheme) {
  electron__WEBPACK_IMPORTED_MODULE_1__.protocol.registerFileProtocol(scheme, (request, callback) => {
    // 重新拼接文件资源路径
    const resolvePath = _main_config_index__WEBPACK_IMPORTED_MODULE_3__.RENDERER_PATH;
    let url = path__WEBPACK_IMPORTED_MODULE_0___default().join(resolvePath, request.url.replace(`${scheme}://`, ""));
    return callback({
      path: decodeURIComponent(url)
    });
  });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  setDefaultProtocol,
  watchMacProtocol,
  watchWindowProtocol,
  registerFileProtocol,
  registerSchemesAsPrivileged
});

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "messageBox": () => (/* binding */ messageBox)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);


function createMessageBoxShow(type) {
  // 这里将window参数反置，因为一般情况下其实不会用到window参数，这里参考了vscode的做法
  return function dialogShowMessageBox(options, window) {
    if (window) {
      return electron__WEBPACK_IMPORTED_MODULE_0__.dialog.showMessageBox(window, {
        type,
        ...options
      });
    }

    return electron__WEBPACK_IMPORTED_MODULE_0__.dialog.showMessageBox({
      type,
      ...options
    });
  };
} // 将不同类型的messageBox封装成不同方法，简化调用，有点儿类似antd的message、toast等


const messageBox = {
  none: createMessageBoxShow("none"),
  info: createMessageBoxShow("info"),
  error: createMessageBoxShow("error"),
  question: createMessageBoxShow("question"),
  warning: createMessageBoxShow("warning")
};

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "APP_PATH": () => (/* binding */ APP_PATH),
/* harmony export */   "MAIN_PATH": () => (/* binding */ MAIN_PATH),
/* harmony export */   "RENDERER_PATH": () => (/* binding */ RENDERER_PATH),
/* harmony export */   "APP_CONFIG": () => (/* binding */ APP_CONFIG)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);


const APP_PATH = electron__WEBPACK_IMPORTED_MODULE_0__.app.getAppPath(); // app.getAppPath() resources/app.asar/

const MAIN_PATH = path__WEBPACK_IMPORTED_MODULE_1___default().join(APP_PATH, 'main/');
const RENDERER_PATH = path__WEBPACK_IMPORTED_MODULE_1___default().join(APP_PATH, 'renderer/');
const APP_CONFIG = {
  scheme: "electron",
  protocol: "electron"
};

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "main": () => (/* reexport module object */ _main_browser_window_windows_main__WEBPACK_IMPORTED_MODULE_2__)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _main_browser_window_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var _main_browser_window_windows_main__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9);



class WindowCenter {
  constructor() {}

  init() {
    this.createMainWindow();
  }

  create(url, { ...options
  }) {}

  createMainWindow() {}

}

function show(win) {
  if (win.isMinimized()) {
    win.restore();
  }

  win.show();
}

function create(url, {
  id,
  data,
  ...options
}) {
  url = [_main_browser_window_config__WEBPACK_IMPORTED_MODULE_1__.RENDERER_ORIGIN, url].join("#");
  let parent = electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow.getFocusedWindow();
  let win = null;
  let _data = data;

  if (options.parent && parent) {
    options.parent = parent;
  }

  electron__WEBPACK_IMPORTED_MODULE_0__.ipcMain.handle([id, 'init'].join(":"), () => {
    return _data;
  });
  electron__WEBPACK_IMPORTED_MODULE_0__.ipcMain.handle([id, 'update'].join(":"), (event, data) => {
    _data = data;
    return true;
  });
  return new Promise((resolve, reject) => {
    win = new electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow({ ..._main_browser_window_config__WEBPACK_IMPORTED_MODULE_1__.defaultWindowOptions,
      ...options
    });
    win.loadURL(url);
    win.once("ready-to-show", () => {
      win && show(win);
    });
    win.on("closed", event => {
      win = null;
      electron__WEBPACK_IMPORTED_MODULE_0__.ipcMain.removeHandler([id, 'init'].join(":"));
      electron__WEBPACK_IMPORTED_MODULE_0__.ipcMain.removeHandler([id, 'update'].join(":"));
      resolve({
        id,
        data: _data
      });
    });
  });
}

electron__WEBPACK_IMPORTED_MODULE_0__.ipcMain.handle('window:create', (event, {
  url,
  ...options
}) => {
  return create(url, options);
});



/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defaultWindowOptions": () => (/* binding */ defaultWindowOptions),
/* harmony export */   "RENDERER_ORIGIN": () => (/* binding */ RENDERER_ORIGIN)
/* harmony export */ });
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _main_config_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);

 // 默认窗口配置

const defaultWindowOptions = {
  // titleBarStyle: "hidden",
  // frame: false,
  show: false,
  webPreferences: {
    webSecurity: false,
    enableRemoteModule: true,
    devTools: true,
    nodeIntegration: true,
    contextIsolation: false,
    nativeWindowOpen: true
  },
  backgroundColor: "#ffffff",
  maximizable: false,
  resizable: false,
  fullscreenable: true,
  fullscreen: false,
  simpleFullscreen: false
};
let RENDERER_ORIGIN = (0,url__WEBPACK_IMPORTED_MODULE_0__.pathToFileURL)(_main_config_index__WEBPACK_IMPORTED_MODULE_1__.RENDERER_PATH).toString();

if (true) {
  let {
    protocol,
    host,
    port
  } = {"host":"localhost","port":8080,"protocol":"http"};
  RENDERER_ORIGIN = `${protocol}://${host}:${port}/`;
}



/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("url");

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "win": () => (/* binding */ win),
/* harmony export */   "create": () => (/* binding */ create),
/* harmony export */   "send": () => (/* binding */ send),
/* harmony export */   "show": () => (/* binding */ show),
/* harmony export */   "hide": () => (/* binding */ hide),
/* harmony export */   "close": () => (/* binding */ close),
/* harmony export */   "getBrowserWindow": () => (/* binding */ getBrowserWindow)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _main_browser_window_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);


let win = null;
const windowConfig = {
  width: 800,
  height: 600
};

function create(options = windowConfig) {
  var _win;

  let url = new URL(`./index.html`, _main_browser_window_config__WEBPACK_IMPORTED_MODULE_1__.RENDERER_ORIGIN).toString();
  win = new electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow({ ..._main_browser_window_config__WEBPACK_IMPORTED_MODULE_1__.defaultWindowOptions,
    ...options
  });
  win.loadURL(url);
  win.once("ready-to-show", () => {
    show();
  });
  (_win = win) === null || _win === void 0 ? void 0 : _win.on("closed", event => {
    win = null;
  });
}

function send(channel, ...args) {
  var _win2, _win2$webContents;

  (_win2 = win) === null || _win2 === void 0 ? void 0 : (_win2$webContents = _win2.webContents) === null || _win2$webContents === void 0 ? void 0 : _win2$webContents.send(channel, ...args);
}

function show() {
  var _win3, _win5;

  if ((_win3 = win) !== null && _win3 !== void 0 && _win3.isMinimized()) {
    var _win4;

    (_win4 = win) === null || _win4 === void 0 ? void 0 : _win4.restore();
  }

  (_win5 = win) === null || _win5 === void 0 ? void 0 : _win5.show();
}

function hide() {
  var _win6;

  (_win6 = win) === null || _win6 === void 0 ? void 0 : _win6.hide();
}

function close() {
  var _win7;

  (_win7 = win) === null || _win7 === void 0 ? void 0 : _win7.close();
}

function getBrowserWindow() {
  return win;
}



/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _main_protocol__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _main_config_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
/* harmony import */ var _main_browser_window_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





console.log("electron main process running.");
console.log("electron main process argvs", process.argv);

class App {
  constructor(config = _main_config_index__WEBPACK_IMPORTED_MODULE_2__.APP_CONFIG) {
    _defineProperty(this, "config", void 0);

    this.config = config;
  }

  bindAppEvent() {
    electron__WEBPACK_IMPORTED_MODULE_0__.app.on("activate", () => {
      if (electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow.getAllWindows().length === 0) {
        _main_browser_window_index__WEBPACK_IMPORTED_MODULE_3__.main.create();
      }
    });
    electron__WEBPACK_IMPORTED_MODULE_0__.app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        electron__WEBPACK_IMPORTED_MODULE_0__.app.quit();
      }
    });
  }

  async registerProtocol() {
    let config = this.config;
    _main_protocol__WEBPACK_IMPORTED_MODULE_1__["default"].setDefaultProtocol(config.protocol);
    _main_protocol__WEBPACK_IMPORTED_MODULE_1__["default"].registerSchemesAsPrivileged(config.scheme);
    await electron__WEBPACK_IMPORTED_MODULE_0__.app.whenReady();
    _main_protocol__WEBPACK_IMPORTED_MODULE_1__["default"].registerFileProtocol(config.scheme);
  }

  async init() {
    this.bindAppEvent();
    this.registerProtocol();
    await electron__WEBPACK_IMPORTED_MODULE_0__.app.whenReady();
    _main_browser_window_index__WEBPACK_IMPORTED_MODULE_3__.main.create();
  }

}

new App().init(); // 启用热更新

if (false) {}
})();

/******/ })()
;