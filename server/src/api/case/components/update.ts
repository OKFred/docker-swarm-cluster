import { and, eq, asc, desc } from "drizzle-orm";
import { db } from "@/db/index";
import { myCaseTable } from "@/db/schema";
import type { myCaseLike } from "@/db/schema";
import { NodeHonoContext, RawRouteConfig } from "@/types/app";
import { validate } from "@cfworker/json-schema";
import { caseIndex, caseUpdateReq, caseUpdateReqLike, caseUpdateResLike } from "./index";
import schemaToParam from "@/api/schemaToParam";
import { errorSchema } from "@/middleware/errorHandler/schema";
import { HTTPException } from "hono/http-exception";

const pathParameters = schemaToParam(caseIndex, "path");

const pathObj = {
    path: "/update/{id}",
    method: "post",
    description: "更新 case",
    summary: "更新 case",
    tags: ["case"],
    parameters: [...pathParameters],
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/caseUpdateReq",
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
                        $ref: "#/components/schemas/caseUpdateRes",
                    },
                },
            },
        },
        422: errorSchema[422],
    },
} satisfies RawRouteConfig;

const controller = async (c: NodeHonoContext) => {
    const id = Number(c.req.param("id")) satisfies myCaseLike["id"];
    const bodyObj = (await c.req.json()) satisfies caseUpdateReqLike;
    const { valid, errors } = validate(bodyObj, caseUpdateReq as object, "2020-12");
    if (!valid) throw new HTTPException(422, { cause: errors });
    const { expectedTime, caseToken, caseSucceed } = bodyObj;
    const updateTime = new Date().toISOString();
    const rows = await db.select().from(myCaseTable).where(eq(myCaseTable.id, id)).limit(1);
    if (rows.length === 0) return c.json({ ok: false, message: "Case not found" }, 404);
    const { serviceId, maxRetry, retryCount } = rows[0];
    const newRetryCount = retryCount ? retryCount + 1 : 1;
    if (maxRetry && newRetryCount > maxRetry) {
        console.log("max retry count reached");
        return c.json({ ok: false, message: "Max retry count reached" }, 400);
    }
    const TimeDifference = new Date().valueOf() - new Date(expectedTime).valueOf();
    if (TimeDifference < 0) {
        console.log("still running");
        return c.json({ ok: false, data: "still running" }, 400);
    }
    const res = await db
        .update(myCaseTable)
        .set({ caseSucceed, caseFinished: true, updateTime, retryCount: newRetryCount })
        .where(and(eq(myCaseTable.id, id), eq(myCaseTable.caseToken, caseToken)));
    if (res.rowsAffected === 0) {
        return c.json({ ok: false, message: "Case not found" }, 404);
    }
    /* setTimeout(async () => {
            console.log("超时，准备清理容器");
            // serviceId && removeService(serviceId);
        }, 20_000); */
    return c.json({ ok: true, data: id } satisfies caseUpdateResLike, 200);
};
export default { pathObj, controller };
