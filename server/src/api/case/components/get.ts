import { and, eq, asc, desc } from "drizzle-orm";
import { db } from "@/db/index";
import { myCaseTable } from "@/db/schema";
import type { myCaseLike, myCaseAddLike } from "@/db/schema";
import { NodeHonoContext, RawRouteConfig } from "@/types/app";
import { validate } from "@cfworker/json-schema";
import { caseGetReq, caseIndex } from "../schema";
import { schemaToParam } from "@/api/register";

const pathParameters = schemaToParam(caseIndex, "path");

const pathObj = {
    path: "/get/{id}",
    method: "get",
    description: "查询 case",
    summary: "查询 case",
    tags: ["case"],
    parameters: [...pathParameters],
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/caseGetReq",
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
                        $ref: "#/components/schemas/caseGetRes",
                    },
                },
            },
        },
    },
} satisfies RawRouteConfig;

// 获取 case 详情接口（用于运行 case）

const handler = async (c: NodeHonoContext) => {
    try {
        const id = Number(c.req.param("id")) satisfies myCaseLike["id"];
        const bodyObj = await c.req.json();
        const { valid, errors } = validate(bodyObj, caseGetReq as object, "2020-12");
        if (!valid) throw new Error("Invalid request body");
        const rows = await db.select().from(myCaseTable).where(eq(myCaseTable.id, id)).limit(1);
        if (rows.length === 0) {
            return c.json({ ok: false, message: "Case not found" });
        }
        return c.json({ ok: true, data: rows[0] });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return c.json({ ok: false, message });
    }
};
export default { pathObj, handler };
