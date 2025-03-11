import type { AppBindings } from "@/types/app.d";
import { OpenAPIHono } from "@hono/zod-openapi";
import addCase from "./add";
import getCase from "./components/get";
import listCase from "./components/list";
import updateCase from "./components/update";
import deleteCase from "./components/delete";
import registerPath from "@/api/register";
import { componentArr } from "./components/index";

function createApp() {
    const app = new OpenAPIHono<AppBindings>();
    componentArr.forEach((component) => {
        app.openAPIRegistry.registerComponent(
            "schemas",
            component.name,
            component.component as any,
        );
    });
    const arr = [addCase, getCase, listCase, updateCase, deleteCase];
    arr.forEach(({ pathObj, controller }) => {
        registerPath(app, pathObj, controller);
    });
    return app;
}

export default createApp;
