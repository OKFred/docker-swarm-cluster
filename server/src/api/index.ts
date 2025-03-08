import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import type { App, AppBindings } from "@/types/app.d";
import { OpenAPIHono } from "@hono/zod-openapi";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function getSubAPI(rootFolder = "" as string) {
    const files = fs.readdirSync(rootFolder);
    let indexFilePath: routeLike["indexFilePath"] = "";
    for (const file of files) {
        if (fs.statSync(`${rootFolder}/${file}`).isDirectory()) {
            continue;
        }
        if (/index./.test(file)) {
            indexFilePath = path.join(rootFolder, file);
            break;
        }
    }
    return indexFilePath;
}

type routeLike = {
    indexFilePath: string;
    namespace: string;
};
async function createApp(app: App): Promise<App> {
    const arr = [] as routeLike[];
    const subFolders = fs.readdirSync(__dirname).filter((folder) => {
        return fs.statSync(`${__dirname}/${folder}`).isDirectory();
    });
    for (const folder of subFolders) {
        const indexFilePath = getSubAPI(`${__dirname}/${folder}`);
        arr.push({ indexFilePath, namespace: folder });
    }
    const _app = new OpenAPIHono<AppBindings>();
    for (const route of arr) {
        const createSubApp = await import(pathToFileURL(route.indexFilePath).href).then(
            (mod) => mod.default,
        );
        const subApp = createSubApp();
        _app.route(`/${route.namespace}`, subApp);
    }
    app.route("/api", _app);
    return app;
}
export default createApp;
