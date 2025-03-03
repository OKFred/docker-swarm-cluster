import type { App } from "@/types/app.ts";

import { logger } from "hono/logger";
export default function corsHandler(app: App) {
    app.use(logger());
}
