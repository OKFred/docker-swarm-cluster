import type { AppBindings } from "@/types/app.d";
import { OpenAPIHono } from "@hono/zod-openapi";
import components from "./components/index";
import addCase from "./components/add";
import getCase from "./components/get";
import listCase from "./components/list";
import updateCase from "./components/update";
import deleteCase from "./components/delete";
import register from "@/api/register";

function createApp() {
    const app = new OpenAPIHono<AppBindings>();
    components(app);
    const arr = [addCase];
    arr.forEach(({ pathObj, handler }) => {
        register(app, pathObj, handler);
    });
    getCase(app);
    listCase(app);
    updateCase(app);
    deleteCase(app);
    return app;
}

export default createApp;
