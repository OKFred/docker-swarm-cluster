import { and, eq, asc, desc } from "drizzle-orm";
import { db } from "@/db/index";
import { myCaseTable } from "../db.model";
import type { myCaseLike } from "../db.model";
import { NodeHonoContext, RawRouteConfig } from "@/types/app";
import { validate } from "@cfworker/json-schema";
import {
    caseIndex,
    caseUpdateReq,
    caseUpdateReqLike,
    caseUpdateResLike,
} from "../api.schema";
import schemaToParam from "@/api/schemaToParam";
import { errorSchema } from "@/middleware/errorHandler/schema";
import { HTTPException } from "hono/http-exception";
import updateService from "./service";

const controller = async (c: NodeHonoContext) => {
    const id = Number(c.req.param("id")) satisfies myCaseLike["id"];
    const bodyObj = (await c.req.json()) satisfies caseUpdateReqLike;
    const { valid, errors } = validate(bodyObj, caseUpdateReq as object, "2020-12");
    if (!valid) throw new HTTPException(422, { cause: errors });
    const updateResult = await updateService(id, bodyObj);
    if (!updateResult) throw new HTTPException(404, { cause: "Case not found or not updated" });
    return c.json({ ok: true, data: id } satisfies caseUpdateResLike, 200);
};

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

export default { pathObj, controller };
