import { OpenAPIHono } from "@hono/zod-openapi";
// import loggerRegister from "@/middlewares/logger";
import errorHandlerRegister from "@/middlewares/errorHandler/index";
// import pathHandler from "@/middlewares/pathHandler";
// import normalRouter from "@/routes/normalRouter";

import type { AppBindings } from "@/types/app.d";
import corsHandler from "@/middlewares/cors/index";
// import basicAuthHandler from "@/middlewares/auth/basic";
import docRegister from "@/doc/index";
import logger from "@/middlewares/logger/index";
import nodeServer from "@/middlewares/nodeServer/index";
import routeRegister from "@/api/index";
async function createApp() {
    const app = new OpenAPIHono<AppBindings>();
    app.get("/", (c) => c.json({ ok: true, message: new Date().toLocaleString() }));
    // loggerRegister(app);
    errorHandlerRegister(app);
    corsHandler(app);
    logger(app);
    // basicAuthHandler(app);
    // bearerAuthHandler(app);
    // pathHandler(app);
    docRegister(app);
    // normalRouter(app);
    await routeRegister(app);
    nodeServer(app);
    return app;
}

const app = createApp();

export default app;
