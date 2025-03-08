import { and, eq, asc, desc } from "drizzle-orm";
import { db } from "@/db/index";
import { myCaseTable } from "@/db/schema";
import type { myCaseLike, myCaseInsertLike } from "@/db/schema";
import { App } from "@/types/app";

function main(app: App) {
    // 获取 case 详情接口（用于运行 case）
    app.get("/case/get/:id", async (c) => {
        try {
            const id = Number(c.req.param("id")) satisfies myCaseLike["id"];
            const rows = await db.select().from(myCaseTable).where(eq(myCaseTable.id, id)).limit(1);
            if (rows.length === 0) {
                return c.json({ ok: false, message: "Case not found" });
            }
            return c.json({ ok: true, data: rows[0] });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            return c.json({ ok: false, message });
        }
    });
}

export default main;
