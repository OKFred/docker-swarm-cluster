import { OpenAPIHono } from "@hono/zod-openapi";
// import loggerRegister from "./middlewares/logger";
import errorHandlerRegister from "./middlewares/errorHandler/index";
// import pathHandler from "./middlewares/pathHandler";
// import docRegister from "./openapi/docRegister";
// import normalRouter from "./routes/normalRouter";

import type { AppBindings } from "./types/app.d";
import corsHandler from "./middlewares/cors/index";
// import basicAuthHandler from "./middlewares/auth/basic";
import logger from "./middlewares/logger/index";
import nodeServer from "./middlewares/nodeServer/index";
import routeRegister from "./routes/index";
function createApp() {
    const app = new OpenAPIHono<AppBindings>();
    // loggerRegister(app);
    errorHandlerRegister(app);
    corsHandler(app);
    logger(app);
    // basicAuthHandler(app);
    // bearerAuthHandler(app);
    // pathHandler(app);
    // docRegister(app);
    // normalRouter(app);
    nodeServer(app);
    routeRegister(app);
    return app;
}

const app = createApp();

export default app;
