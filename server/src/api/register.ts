import { App, NodeHonoContext, RawRouteConfig } from "@/types/app";

/**
 * @description Register a route to the app
 */
function main(
    app: App,
    pathObj: RawRouteConfig,
    handler: (c: NodeHonoContext) => Promise<Response>,
) {
    const { path, method } = pathObj;
    const regExp = /\{(\w+)\}/g;
    const _path = path.replace(regExp, ":$1");
    app[method](_path, handler);
    app.openAPIRegistry.registerPath(pathObj);
    return app;
}

export default main;
