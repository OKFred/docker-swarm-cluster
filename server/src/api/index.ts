import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import type { App, AppBindings } from "@/types/app.d";
import { OpenAPIHono } from "@hono/zod-openapi";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function readFiles(rootFolder = "" as string) {
    const files = fs.readdirSync(rootFolder);
    const arr = [] as string[];
    for (const file of files) {
        if (fs.statSync(`${rootFolder}/${file}`).isDirectory()) {
            continue;
        }
        if (/index./.test(file)) {
            arr.push(path.join(rootFolder, file));
        }
    }
    return arr;
}

async function createApp(app: App): Promise<App> {
    const arr = [] as string[];
    const subFolders = fs.readdirSync(__dirname).filter((folder) => {
        return fs.statSync(`${__dirname}/${folder}`).isDirectory();
    });
    for (const folder of subFolders) {
        const indexFilePaths = readFiles(`${__dirname}/${folder}`);
        arr.push(...indexFilePaths);
    }

    const _app = new OpenAPIHono<AppBindings>();
    for (const file of arr) {
        const thisAPI = await import(pathToFileURL(file).href).then((mod) => mod.default);
        thisAPI(_app);
    }
    app.route("/api", _app);
    return app;
}
export default createApp;
