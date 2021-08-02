import path from 'path';
import { RENDERER_PATH } from "@main/config/index";
import { pathToFileURL } from "url";


let urlOrigin = pathToFileURL(path.join(process.cwd(), RENDERER_PATH)).toString();

if (IS_DEV) {
  let { protocol, host, port } = DEV_SERVER;
  urlOrigin = `${protocol}://${host}:${port}/`;
}

export default urlOrigin;
