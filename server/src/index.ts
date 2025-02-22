import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import fs from "fs";
import path from "path";
import { and, eq, asc, desc } from "drizzle-orm";
import { db } from "./db/index.js";
import { myCaseTable } from "./db/schema.js";
import type { myCaseLike, myCaseInsertLike } from "./db/schema.js";
import { cleanDeadServices, createService } from "./docker/index.js";

const app = new Hono();
app.use(logger());

// 添加 case 接口
app.post("/api/case/add", async (c) => {
    try {
        const { caseName, caseToken, caseTimeout, returnTime } = await c.req.json();
        const resultAdd = await db
            .insert(myCaseTable)
            .values({
                caseName,
                caseToken,
                caseTimeout,
                returnTime,
            })
            .run();
        const id = Number(resultAdd.lastInsertRowid);
        setTimeout(() => {
            createService(id, caseToken);
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
        } = (await c.req.json()) as {
            orderBy: keyof myCaseLike;
            descend: boolean;
            pageNo: number;
            pageSize: number;
        };
        const offset = (pageNo - 1) * pageSize;
        const orderField = myCaseTable[orderBy] || myCaseTable.id;
        const rows = await db
            .select()
            .from(myCaseTable)
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
        const { caseToken, caseSucceed } = await c.req.json();
        const timeUpdated = new Date().toISOString();
        await db
            .update(myCaseTable)
            .set({ caseSucceed, caseFinished: true, timeUpdated })
            .where(and(eq(myCaseTable.id, id), eq(myCaseTable.caseToken, caseToken)));
        // 返回更新后的记录
        setTimeout(() => {
            cleanDeadServices();
        }, 0);
        return c.json({ ok: true, data: id });
    } catch (err) {
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
