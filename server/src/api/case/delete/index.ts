import type { myCaseLike } from "../db.model";
import { NodeHonoContext, RawRouteConfig } from "@/types/app";
import { validate } from "@cfworker/json-schema";
import {
    caseIndex,
    caseDeleteReq,
    caseDeleteReqLike,
    caseDeleteResLike,
} from "../components/index";
import schemaToParam from "@/api/schemaToParam";
import { errorSchema } from "@/middleware/errorHandler/schema";
import { HTTPException } from "hono/http-exception";
import deleteCase from "./service";

const controller = async (c: NodeHonoContext) => {
    const id = Number(c.req.param("id")) satisfies myCaseLike["id"];
    const bodyObj = (await c.req.json()) satisfies caseDeleteReqLike;
    const { valid, errors } = validate(bodyObj, caseDeleteReq as object, "2020-12");
    if (!valid) throw new HTTPException(422, { cause: errors });
    await deleteCase(id, bodyObj);
    return c.json({ ok: true, data: id } satisfies caseDeleteResLike, 200);
};

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
        422: errorSchema[422],
    },
} satisfies RawRouteConfig;

export default { pathObj, controller };
