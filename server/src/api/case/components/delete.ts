import { and, eq, asc, desc } from "drizzle-orm";
import { db } from "@/db/index";
import { myCaseTable } from "@/db/schema";
import type { myCaseLike, myCaseInsertLike } from "@/db/schema";
import { App } from "@/types/app";

function main(app: App) {
    // 删除 case 接口
    app.delete("/delete/:id", async (c) => {
        try {
            const id = Number(c.req.param("id")) satisfies myCaseLike["id"];
            await db.delete(myCaseTable).where(eq(myCaseTable.id, id));
            return c.json({ ok: true, data: id });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            return c.json({ ok: false, message });
        }
    });
}

export default main;
