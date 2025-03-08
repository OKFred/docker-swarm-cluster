import type { AppBindings } from "@/types/app.d";
import { OpenAPIHono } from "@hono/zod-openapi";
import systemInfo from "./components/info";

function createApp() {
    const app = new OpenAPIHono<AppBindings>();
    systemInfo(app);
    return app;
}

export default createApp;
