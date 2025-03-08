import type { AppBindings } from "@/types/app.d";
import { OpenAPIHono } from "@hono/zod-openapi";
import addCase from "./components/add";
import getCase from "./components/get";
import listCase from "./components/list";
import updateCase from "./components/update";
import deleteCase from "./components/delete";

function createApp() {
    const app = new OpenAPIHono<AppBindings>();
    addCase(app);
    getCase(app);
    listCase(app);
    updateCase(app);
    deleteCase(app);
    return app;
}

export default createApp;
