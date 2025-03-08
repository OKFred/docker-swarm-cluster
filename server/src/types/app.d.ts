import { OpenAPIHono } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";
import type { Context } from "hono";
import type { RouteConfig } from "@hono/zod-openapi";
import { ParameterObject, RequestBodyObject } from "openapi3-ts/oas31";
import { RouteConfig } from "@hono/zod-openapi";

export type RawRouteConfig = RouteConfig & {
    method: Exclude<RouteConfig["method"], "head" | "trace">;
    request?: {
        body?: RequestBodyObject;
        params?: ParameterObject;
        query?: ParameterObject;
        cookies?: ParameterObject;
        headers?: ParameterObject;
    };
};
export type routeLike = {
    indexFilePath: string;
    namespace: string;
};

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
    // req: { pathArr: string[] };
};
export type App = OpenAPIHono<AppBindings>;

export type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};