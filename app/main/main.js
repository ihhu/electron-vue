/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("path");;

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("url");;

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("electron");;

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _main_dialog_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
/* harmony import */ var _main_public_urlOrigin__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6);
// 自定义协议




const PROTOCOL_URL = "electron"; // 自定义协议的链接 正则

const DEFAULT_PROTOCOL_REGEXP = new RegExp(`^${PROTOCOL_URL}://`); // 设置自定义协议

function setDefaultProtocol() {
  // 每次运行删除 这样就可以重新注册了
  electron__WEBPACK_IMPORTED_MODULE_1__.app.removeAsDefaultProtocolClient(PROTOCOL_URL); // 开发模式下在window运行需要做兼容

  if (process.env.NODE_ENV === "development" && process.platform === "win32") {
    // 设置electron.exe 和 app的路径
    electron__WEBPACK_IMPORTED_MODULE_1__.app.setAsDefaultProtocolClient(PROTOCOL_URL, process.execPath, [path__WEBPACK_IMPORTED_MODULE_0___default().resolve(process.argv[1])]);
  } else {
    electron__WEBPACK_IMPORTED_MODULE_1__.app.setAsDefaultProtocolClient(PROTOCOL_URL);
  }
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
    const resolvePath = _main_public_urlOrigin__WEBPACK_IMPORTED_MODULE_3__.default;
    let url = request.url.replace(`${scheme}://`, "");
    url = path__WEBPACK_IMPORTED_MODULE_0___default().join(resolvePath, url);
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
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "messageBox": () => (/* binding */ messageBox)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
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
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_1__);


const RENDERER_PATH = "./resources/app.asar/renderer/";
let urlOrigin = (0,url__WEBPACK_IMPORTED_MODULE_1__.pathToFileURL)(path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), RENDERER_PATH)).toString();

if (true) {
  let {
    protocol,
    host,
    port
  } = {"host":"localhost","port":8080,"protocol":"http"};
  urlOrigin = `${protocol}://${host}:${port}/`;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (urlOrigin);

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
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _main_protocol__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);




console.log("electron main process running.");
console.log("electron main process argvs", process.argv);
const RENDERER_PATH = "./resources/app.asar/renderer/";
let urlOrigin = (0,url__WEBPACK_IMPORTED_MODULE_1__.pathToFileURL)(path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), RENDERER_PATH)).toString();

if (true) {
  urlOrigin = `${{"host":"localhost","port":8080,"protocol":"http"}.protocol}://${{"host":"localhost","port":8080,"protocol":"http"}.host}:${{"host":"localhost","port":8080,"protocol":"http"}.port}/`;
  console.log("electron main process devServer", urlOrigin, new URL("./", urlOrigin).toString());
}

function createWindow() {
  const win = new electron__WEBPACK_IMPORTED_MODULE_2__.BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    // frame : false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: true,
      contextIsolation: false
    }
  });
  win.loadURL(new URL("./index.html", urlOrigin).toString());
}

electron__WEBPACK_IMPORTED_MODULE_2__.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron__WEBPACK_IMPORTED_MODULE_2__.app.quit();
  }
});
electron__WEBPACK_IMPORTED_MODULE_2__.app.on("activate", () => {
  if (electron__WEBPACK_IMPORTED_MODULE_2__.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); // app.whenReady().then(createWindow)

electron__WEBPACK_IMPORTED_MODULE_2__.app.on("ready", () => {
  _main_protocol__WEBPACK_IMPORTED_MODULE_3__.default.registerFileProtocol("electron");
  createWindow();
}); // 启用热更新

if (false) {}
})();

/******/ })()
;