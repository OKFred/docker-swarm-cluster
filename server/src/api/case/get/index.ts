import { and, eq, asc, desc } from "drizzle-orm";
import { db } from "@/db/index";
import { myCaseTable } from "../db.model";
import type { myCaseLike, myCaseAddLike } from "../db.model";
import { NodeHonoContext, RawRouteConfig } from "@/types/app";
import { validate } from "@cfworker/json-schema";
import { caseGetReq, caseGetReqLike, caseGetResLike, caseIndex } from "../components/index";
import schemaToParam from "@/api/schemaToParam";
import { errorSchema } from "@/middleware/errorHandler/schema";
import { HTTPException } from "hono/http-exception";
import getCase from "./service";

// 获取 case 详情接口（用于运行 case）

const controller = async (c: NodeHonoContext) => {
    const id = Number(c.req.param("id")) satisfies myCaseLike["id"];
    const paramObj = c.req.query() as caseGetReqLike;
    const { valid, errors } = validate(paramObj, caseGetReq as object, "2020-12");
    if (!valid) throw new HTTPException(422, { cause: errors });
    const row = await getCase(id, paramObj);
    if (!row.id) throw new HTTPException(404, { cause: "未找到该 case" });
    return c.json({ ok: true, data: row } satisfies caseGetResLike, 200);
};

const pathParameters = schemaToParam(caseIndex, "path");
const queryParameters = schemaToParam({ $ref: "#/components/schemas/caseGetReq" }, "query");

const pathObj = {
    path: "/get/{id}",
    method: "get",
    description: "查询 case",
    summary: "查询 case",
    tags: ["case"],
    parameters: [...pathParameters, ...queryParameters],
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

export default { pathObj, controller };
