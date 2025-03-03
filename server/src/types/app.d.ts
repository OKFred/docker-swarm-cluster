import { OpenAPIHono } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";
import type { Context } from "hono";
import type { RouteConfig } from "@hono/zod-openapi";

export type AppBindings = {
    Variables: {
        logger: PinoLogger;
    };
    Bindings: Env;
};

export type pathObjLike = RouteConfig & {
    // eslint-disable-next-line no-unused-vars
    handler: (c: NodeHonoContext) => Promise<Response>;
};

export type NodeHonoContext = Context<AppBindings> & {
    req: { pathArr: string[] };
};
export type App = OpenAPIHono<AppBindings>;
