import { OpenAPIHono } from "@hono/zod-openapi";
// import loggerRegister from "@/middlewares/logger";
import errorHandler from "@/middleware/errorHandler/index";
// import pathHandler from "@/middlewares/pathHandler";
// import normalRouter from "@/routes/normalRouter";

import type { AppBindings, NodeHonoContext } from "@/types/app.d";
import corsHandler from "@/middleware/cors/index";
// import basicAuthHandler from "@/middlewares/auth/basic";
import docRegister from "@/doc/index";
import logger from "@/middleware/logger/index";
import nodeServer from "@/middleware/nodeServer/index";
import routeRegister from "@/api/index";
async function createApp() {
  const app = new OpenAPIHono<AppBindings>();
  app.get("/", (c: NodeHonoContext) =>
    c.json({ ok: true, message: new Date().toLocaleString() })
  );
  // loggerRegister(app);
  errorHandler(app);
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
