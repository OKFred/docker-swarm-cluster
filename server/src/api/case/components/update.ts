import { and, eq, asc, desc } from "drizzle-orm";
import { db } from "@/db/index";
import { myCaseTable } from "@/db/schema";
import type { myCaseLike } from "@/db/schema";
import { App } from "@/types/app";

function main(app: App) {
    // 更新 case 接口（回调）
    app.post("/case/update/:id", async (c) => {
        try {
            const id = Number(c.req.param("id")) satisfies myCaseLike["id"];
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
            const message = err instanceof Error ? err.message : "Unknown error";
            return c.json({ ok: false, message });
        }
    });
}

export default main;
