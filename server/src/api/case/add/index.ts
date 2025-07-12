import { NodeHonoContext, RawRouteConfig } from "@/types/app";
import { validate } from "@cfworker/json-schema";
import { HTTPException } from "hono/http-exception";
import httpStatusCode from "http-status-codes";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { errorSchema } from "@/middleware/errorHandler/schema";
import addCase from "./service";
import { myCase, caseIndex, myCaseAddLike, serviceOptions } from "../db.table";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";

export type caseAddReqLike = FromSchema<typeof caseAddReq>;
export type caseAddResLike = FromSchema<typeof caseAddRes>;

const caseAddReq = {
    type: "object",
    properties: {
        ...myCase,
        serviceOptions,
    } satisfies Partial<Record<keyof myCaseAddLike, JSONSchema>>,
    required: ["caseName", "caseTimeout", "returnTime", "caseToken"],
    additionalProperties: false,
} as const satisfies JSONSchema;

const caseAddRes = {
    type: "object",
    properties: {
        ok: { type: "boolean" },
        data: { ...caseIndex["id"] },
        message: { type: "string" },
    },
    required: ["ok", "data"],
    additionalProperties: false,
} as const satisfies JSONSchema;

const componentArr = [
    {
        type: "schema",
        name: "caseAddReq",
        component: caseAddReq,
    },
    {
        type: "schema",
        name: "caseAddRes",
        component: caseAddRes,
    },
];

const controller = async (c: NodeHonoContext) => {
    const bodyObj = await c.req.json(); /*  satisfies caseAddReqLike */ //TODO： TS -> JSON Schema
    const { valid, errors } = validate(bodyObj, caseAddReq as object, "2020-12");
    if (!valid)
        throw new HTTPException(httpStatusCode.UNPROCESSABLE_ENTITY as ContentfulStatusCode, {
            cause: errors,
        });
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
                    $ref: `#/components/schemas/${componentArr[0].name}`,
                },
            },
        },
    },
    responses: {
        [httpStatusCode.OK as ContentfulStatusCode]: {
            description: "成功",
            content: {
                "application/json": {
                    schema: {
                        $ref: `#/components/schemas/${componentArr[1].name}`,
                    },
                },
            },
        },
        [httpStatusCode.UNPROCESSABLE_ENTITY]: errorSchema[422],
    },
} satisfies RawRouteConfig;

export default { pathObj, controller };
