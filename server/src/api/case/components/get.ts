import { and, eq, asc, desc } from "drizzle-orm";
import { db } from "@/db/index";
import { myCaseTable } from "@/db/schema";
import type { myCaseLike, myCaseAddLike } from "@/db/schema";
import { NodeHonoContext, RawRouteConfig } from "@/types/app";
import { validate } from "@cfworker/json-schema";
import { caseGetReq, caseGetReqLike, caseGetResLike, caseIndex } from "../schema";
import { schemaToParam } from "@/api/register";
import { errorSchema } from "@/middleware/errorHandler/schema";
import { HTTPException } from "hono/http-exception";

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
        422: errorSchema[422],
    },
} satisfies RawRouteConfig;

// 获取 case 详情接口（用于运行 case）

const handler = async (c: NodeHonoContext) => {
    const id = Number(c.req.param("id")) satisfies myCaseLike["id"];
    const bodyObj = (await c.req.json()) satisfies caseGetReqLike;
    const { valid, errors } = validate(bodyObj, caseGetReq as object, "2020-12");
    if (!valid) throw new HTTPException(422, { cause: errors });
    const rows = await db
        .select()
        .from(myCaseTable)
        .where(
            and(
                eq(myCaseTable.id, id),
                eq(myCaseTable.caseToken, bodyObj.caseToken),
                bodyObj.caseName ? eq(myCaseTable.caseName, bodyObj.caseName) : undefined,
            ),
        )
        .limit(1);
    if (rows.length === 0) {
        return c.json({ ok: false, message: "Case not found" }, 404);
    }
    return c.json({ ok: true, data: rows[0] } satisfies caseGetResLike, 200);
};
export default { pathObj, handler };
