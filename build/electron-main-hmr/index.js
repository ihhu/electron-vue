const socketPath = HMR_SOCKET_PATH!
if (!socketPath) {
    throw new Error(`[HMR] ELECTRON_HMR_SOCKET_PATH is not set`)
}

const HmrClient = require("./HmrClient.js");

new HmrClient(socketPath, module.hot, () => {
    return __webpack_hash__
})