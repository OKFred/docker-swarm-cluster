import type { AppBindings } from "@/types/app.d";
import { OpenAPIHono } from "@hono/zod-openapi";
import registerPath from "@/api/register";
import addCase from "./add";
import getCase from "./get";
import listCase from "./list";
import updateCase from "./update";
import deleteCase from "./delete";
import { componentArr } from "./api.schema";
import {tableInit} from "./db.table";
import pathRegister from "../pathRegister";

function createApp() {
    tableInit();
    const app = new OpenAPIHono<AppBindings>();
    componentArr.forEach((component) => {
        app.openAPIRegistry.registerComponent(
            "schemas",
            component.name,
            component.component as any,
        );
    });
    const arr = [addCase, getCase, listCase, updateCase, deleteCase];
    arr.forEach(({ pathObj, controller, componentArr }) => {
        pathRegister(app, pathObj, controller);
        if (componentArr) {
            componentArr.forEach((component) => {
                app.openAPIRegistry.registerComponent(
                    "schemas",
                    component.name,
                    component.component,
                );
            });
        }
    });
    return app;
}

export default createApp;
