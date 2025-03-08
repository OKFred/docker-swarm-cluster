import os from "os";
import type { App } from "@/types/app.d";
function main(app: App) {
    app.get("/info", async (c) => {
        const data = {
            node: os.hostname(),
            platform: os.platform(),
            arch: os.arch(),
            cpus: os.cpus().length,
            memory: os.totalmem(),
            uptime: os.uptime(),
            loadavg: os.loadavg(),
            totalmem: os.totalmem(),
            freemem: os.freemem(),
            hostname: os.hostname(),
            type: os.type(),
            release: os.release(),
            networkInterfaces: os.networkInterfaces(),
        };
        return c.json({ ok: true, data });
    });
    return app;
}

export default main;
