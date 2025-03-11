import { NodeHonoContext, RawRouteConfig } from "@/types/app";
import { validate } from "@cfworker/json-schema";
import { caseListReq, caseListReqLike, caseListResLike } from "../components/index";
import { errorSchema } from "@/middleware/errorHandler/schema";
import { HTTPException } from "hono/http-exception";
import listCase from "./service";

const controller = async (c: NodeHonoContext) => {
    const bodyObj = (await c.req.json()) satisfies caseListReqLike;
    const { valid, errors } = validate(bodyObj, caseListReq as object, "2020-12");
    if (!valid) throw new HTTPException(422, { cause: errors });
    const listResult = await listCase(bodyObj);
    return c.json({ ok: true, data: listResult } satisfies caseListResLike, 200);
};

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
        422: errorSchema[422],
    },
} satisfies RawRouteConfig;

export default { pathObj, controller };
