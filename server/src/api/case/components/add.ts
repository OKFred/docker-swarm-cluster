import { and, eq, asc, desc } from "drizzle-orm";
import { db } from "@/db/index";
import { myCaseTable } from "@/db/schema";
import type { myCaseAddLike } from "@/db/schema";
import { createOrUpdateService } from "@/docker/index";
import Dockerode from "dockerode";
import { NodeHonoContext, RawRouteConfig } from "@/types/app";
import { validate } from "@cfworker/json-schema";
import { caseAddReq, caseAddReqLike, caseAddResLike } from "./index";
import { HTTPException } from "hono/http-exception";
import { errorSchema } from "@/middleware/errorHandler/schema";

process.env.SERVER_URL ??
    (console.error("env SERVER_URL is not set") !== void 0 || process.exit(1));

process.env.CASE_IMAGE_NAME ??
    (console.error("env CASE_IMAGE_NAME is not set") !== void 0 || process.exit(1));

const pathObj = {
    path: "/add",
    method: "post",
    description: "添加 case",
    summary: "添加 case",
    tags: ["case"],
    parameters: [],
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/caseAddReq",
                },
            },
        },
    },
    responses: {
        200: {
            description: "成功",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/caseAddRes",
                    },
                },
            },
        },
        422: errorSchema[422],
    },
} satisfies RawRouteConfig;

const controller = async (c: NodeHonoContext) => {
    const bodyObj = await c.req.json(); /*  satisfies caseAddReqLike */ //TODO： TS -> JSON Schema
    const { valid, errors } = validate(bodyObj, caseAddReq as object, "2020-12");
    if (!valid) throw new HTTPException(422, { cause: errors });
    let { caseName, caseToken, caseTimeout, returnTime, serviceOptions } = bodyObj;
    const expectedTime = new Date(new Date().valueOf() + caseTimeout).toISOString();
    const resultAdd = await db
        .insert(myCaseTable)
        .values({
            caseName,
            caseToken,
            caseTimeout,
            returnTime,
            expectedTime,
        } satisfies myCaseAddLike)
        .run();
    const id = Number(resultAdd.lastInsertRowid);
    if (!serviceOptions) {
        serviceOptions = {
            Name: `case-service-${id}`, // 根据任务ID生成服务名称
            TaskTemplate: {
                ContainerSpec: {
                    Image: process.env.CASE_IMAGE_NAME, // 使用预先构建好的镜像
                    Env: [
                        `SERVER_URL=${process.env.SERVER_URL}`,
                        `CASE_ID=${id}`,
                        `CASE_TOKEN=${caseToken}`,
                    ], // 环境变量
                },
                RestartPolicy: {
                    Condition: "on-failure", // 重启策略
                },
                Resources: {
                    Limits: { MemoryBytes: 1000000000 }, // 根据需要配置资源限制
                },
                Placement: {
                    Constraints: ["node.labels.role == case"], // 限制容器在拥有 'case' 标签的节点上运行
                },
            },
            Mode: {
                Replicated: {
                    Replicas: 1,
                }, // 任务自动故障转移
            },
        } satisfies Dockerode.ServiceSpec;
    } //详见： https://docs.docker.com/reference/compose-file/deploy/
    const terminateTimeout = caseTimeout + 60_000; //设置任务到期60秒后自动清理服务
    const serviceId = await createOrUpdateService(serviceOptions, terminateTimeout);
    await db.update(myCaseTable).set({ serviceId }).where(eq(myCaseTable.id, id));
    return c.json({ ok: true, data: id } satisfies caseAddResLike, 200);
};
export default { pathObj, controller };
