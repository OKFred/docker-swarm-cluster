import { and, eq, asc, desc } from "drizzle-orm";
import { db } from "@/db/index";
import { myCaseTable } from "@/db/schema";
import type { myCaseLike } from "@/db/schema";
import { App } from "@/types/app";

function main(app: App) {
    // 列表 case 接口
    app.post("/case/list", async (c) => {
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
            const message = err instanceof Error ? err.message : "Unknown error";
            return c.json({ ok: false, message });
        }
    });
}

export default main;
