import { and, eq, asc, desc } from "drizzle-orm";
import { db } from "@/db/index";
import { myCaseTable } from "@/db/schema";
import type { myCaseLike } from "@/db/schema";
import { NodeHonoContext, RawRouteConfig } from "@/types/app";
import { validate } from "@cfworker/json-schema";
import { caseIndex, caseDeleteReq } from "../schema";
import { schemaToParam } from "@/api/register";

const pathParameters = schemaToParam(caseIndex, "path");

const pathObj = {
    path: "/delete/{id}",
    method: "delete",
    description: "删除 case",
    summary: "删除 case",
    tags: ["case"],
    parameters: [...pathParameters],
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/caseDeleteReq",
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
    },
} satisfies RawRouteConfig;

const handler = async (c: NodeHonoContext) => {
    // 删除 case 接口
    try {
        const id = Number(c.req.param("id")) satisfies myCaseLike["id"];
        const bodyObj = await c.req.json();
        const { valid, errors } = validate(bodyObj, caseDeleteReq as object, "2020-12");
        if (!valid) throw new Error("Invalid request body");
        await db
            .delete(myCaseTable)
            .where(and(eq(myCaseTable.id, id), eq(myCaseTable.caseToken, bodyObj.caseToken)));
        return c.json({ ok: true, data: id });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return c.json({ ok: false, message });
    }
};

export default { pathObj, handler };
