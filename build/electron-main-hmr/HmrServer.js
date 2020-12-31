const Crocket = require("crocket");

class HmrServer {
    state = false;
    socketPath = "";
    ipc = new Crocket();

    listen(){
        return new Promise((resolve,reject)=>{
            const socketPath = `/tmp/electron-main-ipc-${process.pid.toString(16)}.sock`;
            this.socketPath = socketPath;
            this.ipc.listen({path:socketPath}, error=>{
                if(error){ 
                    reject(error)
                }
                console.log(`[HmrServer] HMR Server listening on ${socketPath}`)
                resolve(socketPath)
            })
        })
    }

    beforeCompile(){
        this.state = false;
    }

    built(stats){
        this.state = true
        setImmediate(() => {
            if (!this.state) {
                return
            }

            const hash = stats.toJson({assets: false, chunks: false, children: false, modules: false}).hash;

            console.log(`[HmrServer] Send built: hash ${hash}`);

            this.ipc.emit("/built", {hash})
        })
    }
}

module.exports = HmrServer;