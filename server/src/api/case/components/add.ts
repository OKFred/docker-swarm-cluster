import { and, eq, asc, desc } from "drizzle-orm";
import { db } from "@/db/index";
import { myCaseTable } from "@/db/schema";
import type { myCaseInsertLike } from "@/db/schema";
import { createOrUpdateService } from "@/docker/index";
import Dockerode from "dockerode";
import { App } from "@/types/app";

process.env.SERVER_URL ??
    (console.error("env SERVER_URL is not set") !== void 0 || process.exit(1));

process.env.CASE_IMAGE_NAME ??
    (console.error("env CASE_IMAGE_NAME is not set") !== void 0 || process.exit(1));

function main(app: App) {
    // 添加 case 接口·
    app.post("/case/add", async (c) => {
        try {
            let { caseName, caseToken, caseTimeout, returnTime, serviceOptions, terminateTimeout } =
                await c.req.json();
            const expectedTime = new Date(new Date().valueOf() + caseTimeout).toISOString();
            const resultAdd = await db
                .insert(myCaseTable)
                .values({
                    caseName,
                    caseToken,
                    caseTimeout,
                    returnTime,
                    expectedTime,
                } satisfies myCaseInsertLike)
                .run();
            const id = Number(resultAdd.lastInsertRowid);
            setTimeout(async () => {
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
                terminateTimeout ?? (terminateTimeout = 60_000); //设置60秒后自动清理服务（演示用）
                const serviceId = await createOrUpdateService(serviceOptions, terminateTimeout);
                await db.update(myCaseTable).set({ serviceId }).where(eq(myCaseTable.id, id));
            }, 0);
            return c.json({ ok: true, data: id });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            return c.json({ ok: false, message });
        }
    });
}

export default main;
