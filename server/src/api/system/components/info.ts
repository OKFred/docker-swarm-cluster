import os from "os";
import { errorSchema } from "@/middleware/errorHandler/schema";
import type { NodeHonoContext, RawRouteConfig } from "@/types/app.d";
import schemaToParam from "@/api/schemaToParam";
import { systemInfoResLike } from ".";

const queryParameters = schemaToParam({ $ref: "#/components/schemas/systemInfoReq" }, "query");
2;
const controller = async (c: NodeHonoContext) => {
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
    return c.json({ ok: true, data } satisfies systemInfoResLike, 200);
};

const pathObj = {
    path: "/info",
    method: "get",
    description: "获取系统信息",
    summary: "获取系统信息",
    tags: ["system"],
    parameters: [...queryParameters],
    responses: {
        200: {
            description: "成功",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/systemInfoRes",
                    },
                },
            },
        },
        500: errorSchema[500],
    },
} satisfies RawRouteConfig;

export default { pathObj, controller };
