import type { AppBindings } from "@/types/app.d";
import { OpenAPIHono } from "@hono/zod-openapi";
import systemInfo from "./components/info";

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
    const arr = [systemInfo];
    arr.forEach(({ pathObj, controller }) => {
        registerPath(app, pathObj, controller);
    });
    return app;
}

export default createApp;
