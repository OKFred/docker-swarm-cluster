import { and, eq, asc, desc } from "drizzle-orm";
import { db } from "@/db/index";
import { myCaseTable } from "@/db/schema";
import type { myCaseLike } from "@/db/schema";
import { NodeHonoContext, RawRouteConfig } from "@/types/app";
import { validate } from "@cfworker/json-schema";
import { caseIndex, caseListReq, caseListReqLike } from "../schema";

const pathObj = {
    path: "/list",
    method: "post",
    description: "查询 case列表",
    summary: "查询 case列表",
    tags: ["case"],
    parameters: [],
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/caseListReq",
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
                        $ref: "#/components/schemas/caseListRes",
                    },
                },
            },
        },
    },
} satisfies RawRouteConfig;

const handler = async (c: NodeHonoContext) => {
    try {
        const bodyObj = (await c.req.json()) as  caseListReqLike;
      const { valid, errors } = validate(bodyObj, caseListReq as object, "2020-12");
      if (!valid) throw new Error("Invalid request body");
      const { orderBy = "id", descend = true, pageNo = 1, pageSize = 10, keyword = "" } = bodyObj;
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
};
export default { pathObj, handler };
