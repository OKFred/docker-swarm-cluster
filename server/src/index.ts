import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import fs from "fs";
import path from "path";
import { and, eq, asc, desc } from "drizzle-orm";
import { db } from "./db/index.js";
import { myCaseTable } from "./db/schema.js";
import type { myCaseLike, myCaseInsertLike } from "./db/schema.js";
import { createOrUpdateService } from "./docker/index.js";
import { sendFeishuMessage } from "./rpc/feishu/instance.js";
import Dockerode from "dockerode";
import dotenv from "dotenv";
dotenv.config();

process.env.SERVER_URL ??
    (console.error("env SERVER_URL is not set") !== void 0 || process.exit(1));

process.env.CASE_IMAGE_NAME ??
    (console.error("env CASE_IMAGE_NAME is not set") !== void 0 || process.exit(1));

const app = new Hono();
app.use(logger());

// 添加 case 接口
app.post("/api/case/add", async (c) => {
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
            })
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
        if (err instanceof Error === false) return;
        return c.json({ ok: false, message: err.message });
    }
});

// 列表 case 接口
app.post("/api/case/list", async (c) => {
    try {
        const {
            orderBy = "id",
            descend = true,
            pageNo = 1,
            pageSize = 10,
            keyword = "",
        } = (await c.req.json()) as {
            orderBy: keyof myCaseLike;
            descend: boolean;
            pageNo: number;
            pageSize: number;
            keyword: string;
        };
        const offset = (pageNo - 1) * pageSize;
        const orderField = myCaseTable[orderBy] || myCaseTable.id;
        const rows = await db
            .select()
            .from(myCaseTable)
            .where(keyword ? eq(myCaseTable.caseName, keyword) : undefined)
            .orderBy(!descend ? asc(orderField) : desc(orderField))
            .limit(pageSize)
            .offset(offset);
        return c.json({ ok: true, data: rows });
    } catch (err) {
        if (err instanceof Error === false) return;
        return c.json({ ok: false, message: err.message });
    }
});

// 获取 case 详情接口（用于运行 case）
app.get("/api/case/get/:id", async (c) => {
    try {
        const id = Number(c.req.param("id"));
        const rows = await db.select().from(myCaseTable).where(eq(myCaseTable.id, id)).limit(1);
        if (rows.length === 0) {
            return c.json({ ok: false, message: "Case not found" });
        }
        return c.json({ ok: true, data: rows[0] });
    } catch (err) {
        if (err instanceof Error === false) return;
        return c.json({ ok: false, message: err.message });
    }
});

// 更新 case 接口（回调）
app.post("/api/case/update/:id", async (c) => {
    try {
        const id = Number(c.req.param("id"));
        const { expectedTime, caseToken, caseSucceed } = await c.req.json();
        const updateTime = new Date().toISOString();
        const rows = await db.select().from(myCaseTable).where(eq(myCaseTable.id, id)).limit(1);
        if (rows.length === 0) return c.json({ ok: false, message: "Case not found" });
        const { serviceId, maxRetry, retryCount } = rows[0];
        const newRetryCount = retryCount ? retryCount + 1 : 1;
        if (maxRetry && newRetryCount > maxRetry) {
            console.log("max retry count reached");
            return c.json({ ok: false, message: "Max retry count reached" });
        }
        const TimeDifference = new Date().valueOf() - new Date(expectedTime).valueOf();
        if (TimeDifference < 0) {
            console.log("still running");
            return c.json({ ok: false, data: "still running" });
        }
        const res = await db
            .update(myCaseTable)
            .set({ caseSucceed, caseFinished: true, updateTime, retryCount: newRetryCount })
            .where(and(eq(myCaseTable.id, id), eq(myCaseTable.caseToken, caseToken)));
        if (res.rowsAffected === 0) {
            return c.json({ ok: false, message: "Case not found" });
        }
        /* setTimeout(async () => {
            console.log("超时，准备清理容器");
            // serviceId && removeService(serviceId);
        }, 20_000); */
        return c.json({ ok: true, data: id });
    } catch (err) {
        console.log(err);
        if (err instanceof Error === false) return;
        return c.json({ ok: false, message: err.message });
    }
});

// 删除 case 接口
app.delete("/api/case/delete/:id", async (c) => {
    try {
        const id = Number(c.req.param("id"));
        await db.delete(myCaseTable).where(eq(myCaseTable.id, id));
        return c.json({ ok: true });
    } catch (err) {
        if (err instanceof Error === false) return;
        return c.json({ ok: false, message: err.message });
    }
});

// 返回 OpenAPI 文档 doc.json
app.get("/doc.json", async (c) => {
    const docPath = path.join(process.cwd(), "src", "doc", "index.json");
    try {
        const docContent = fs.readFileSync(docPath, "utf-8");
        return c.body(docContent, 200, { "Content-Type": "application/json" });
    } catch (e) {
        return c.json({ ok: false, message: "Failed to read doc.json" });
    }
});

// 返回 Swagger UI 页面
app.get("/doc", async (c) => {
    const docHtmlPath = path.join(process.cwd(), "src", "doc", "index.html");
    try {
        const htmlContent = fs.readFileSync(docHtmlPath, "utf-8");
        return c.body(htmlContent, 200, { "Content-Type": "text/html" });
    } catch (e) {
        return c.json({ ok: false, message: "Failed to read doc/index.html" });
    }
});

// 健康检查接口
app.get("/", (c) => c.json({ ok: true, message: new Date().toLocaleString() }));

// 启动服务器
const PORT = Number(process.env.PORT) || 3000;
setTimeout(() => {
    serve({
        port: PORT,
        fetch: app.fetch,
    });
    console.log(`Server listening on http://localhost:${PORT}`);
}, 0);

/**
 * @description: 未捕获异常处理事件上报
 */
process.on("uncaughtException", function (err) {
    console.error("uncaughtException:", err);
    sendFeishuMessage("uncaughtException:" + err);
});

sendFeishuMessage("服务器已启动").then(async (res) => {
    const result = await res?.json();
    console.log(result);
});
