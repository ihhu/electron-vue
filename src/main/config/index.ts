import path from "path";
import { pathToFileURL } from "url";

const RENDERER_PATH = "./resources/app.asar/renderer/";

let urlOrigin =  pathToFileURL(path.join(process.cwd(),RENDERER_PATH)).toString();


if(IS_DEV){
    let { protocol, host, port} = DEV_SERVER;
    urlOrigin = `${protocol}://${host}:${port}/`
}

export { urlOrigin };