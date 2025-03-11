import { NodeHonoContext, RawRouteConfig } from "@/types/app";
import { validate } from "@cfworker/json-schema";
import { caseAddReq, caseAddReqLike, caseAddResLike } from "../components/index";
import { HTTPException } from "hono/http-exception";
import { errorSchema } from "@/middleware/errorHandler/schema";
import addCase from "./service";

const controller = async (c: NodeHonoContext) => {
    const bodyObj = await c.req.json(); /*  satisfies caseAddReqLike */ //TODO： TS -> JSON Schema
    const { valid, errors } = validate(bodyObj, caseAddReq as object, "2020-12");
    if (!valid) throw new HTTPException(422, { cause: errors });
    const id = await addCase(bodyObj);
    return c.json({ ok: true, data: id } satisfies caseAddResLike, 200);
};

const pathObj = {
    path: "/add",
    method: "post",
    description: "添加 case",
    summary: "添加 case",
    tags: ["case"],
    parameters: [],
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/caseAddReq",
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
