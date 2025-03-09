import type { FromSchema, JSONSchema } from "json-schema-to-ts";
import {
    myCase,
    myCaseAddable,
    myCaseReadable,
    myCaseUpdatable,
    myCaseDeletable,
    type myCaseLike,
} from "@/db/schema";
import Dockerode from "dockerode";

const oneOf = [
    {
        properties: { ok: { const: true } },
        required: ["data"],
    },
    {
        properties: { ok: { const: false } },
        required: ["message"],
    },
] as const;

export const caseIndex = {
    type: "object",
    properties: {
        id: {
            type: "number",
            description: "case id",
        },
    } as const satisfies Partial<Record<keyof myCaseLike, JSONSchema>>,
    required: ["id"] as string[],
    additionalProperties: false,
} as const satisfies JSONSchema;

export const caseAddReq = {
    type: "object",
    properties: {
        ...myCaseAddable,
        serviceOptions: {
            type: "object",
            properties: {
                Name: { type: "string" },
                Labels: { type: "object" },
                TaskTemplate: { type: "object" },
                Mode: { type: "object" },
                UpdateConfig: { type: "object" },
                RollbackConfig: { type: "object" },
                Networks: { type: "array" },
                EndpointSpec: { type: "object" },
            },
        },
        terminateTimeout: { type: "number" },
    } satisfies Partial<
        Record<
            | keyof myCaseLike
            | keyof {
                  serviceOptions: Dockerode.ServiceSpec;
                  terminateTimeout: number;
              },
            JSONSchema
        >
    >,
    required: ["caseName", "caseToken", "caseTimeout", "returnTime"],
    additionalProperties: false,
} as const satisfies JSONSchema;

export const caseAddRes = {
    type: "object",
    properties: {
        ok: { type: "boolean" },
        data: { ...caseIndex["properties"]["id"] },
        message: { type: "string" },
    },
    required: ["ok"],
    oneOf,
    additionalProperties: false,
} as const satisfies JSONSchema;

export const caseGetReq = {
    type: "object",
    properties: { ...myCaseReadable },
    required: ["caseToken"],
    additionalProperties: false,
} as const satisfies JSONSchema;

export const caseGetRes = {
    type: "object",
    properties: {
        ok: { type: "boolean" },
        data: {
            type: "object",
            properties: { ...myCase },
            additionalProperties: false,
        },
        message: { type: "string" },
    },
    required: ["ok"],
    oneOf,
    additionalProperties: false,
} as const satisfies JSONSchema;

export const caseListReq = {
    type: "object",
    properties: {
        orderBy: {
            type: "string",
            enum: [
                "id",
                "caseName",
                "caseToken",
                "caseTimeout",
                "returnTime",
            ] satisfies (keyof myCaseLike)[],
        },
        descend: { type: "boolean" },
        pageNo: { type: "number", minimum: 1 },
        pageSize: { type: "number", maximum: 1000 },
        keyword: { type: "string" },
    },
    required: [],
    additionalProperties: false,
} as const satisfies JSONSchema;

export const caseListRes = {
    type: "object",
    properties: {
        ok: { type: "boolean" },
        data: {
            type: "array",
            items: {
                type: "object",
                properties: { ...myCase },
                additionalProperties: false,
            },
        },
        message: { type: "string" },
    },
    required: ["ok"],
    oneOf,
    additionalProperties: false,
} as const satisfies JSONSchema;

export const caseUpdateReq = {
    type: "object",
    properties: {
        ...myCaseUpdatable,
    },
    required: ["caseToken", "expectedTime", "caseSucceed"],
    additionalProperties: false,
} as const satisfies JSONSchema;

export const caseUpdateRes = {
    type: "object",
    properties: {
        ok: { type: "boolean" },
        data: { ...caseIndex["properties"]["id"] },
        message: { type: "string" },
    },
    required: ["ok"],
    oneOf,
    additionalProperties: false,
} as const satisfies JSONSchema;

export const caseDeleteReq = {
    type: "object",
    properties: {
        ...myCaseDeletable,
    },
    required: ["caseToken"],
    additionalProperties: false,
} as const satisfies JSONSchema;

export const caseDeleteRes = {
    type: "object",
    properties: {
        ok: { type: "boolean" },
        data: { ...caseIndex["properties"]["id"] },
        message: { type: "string" },
    },
    required: ["ok"],
    oneOf,
    additionalProperties: false,
} as const satisfies JSONSchema;

export const componentArr = [
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
    {
        type: "schema",
        name: "caseGetReq",
        component: caseGetReq,
    },
    {
        type: "schema",
        name: "caseGetRes",
        component: caseGetRes,
    },
    {
        type: "schema",
        name: "caseListReq",
        component: caseListReq,
    },
    {
        type: "schema",
        name: "caseListRes",
        component: caseListRes,
    },
    {
        type: "schema",
        name: "caseUpdateReq",
        component: caseUpdateReq,
    },
    {
        type: "schema",
        name: "caseUpdateRes",
        component: caseUpdateRes,
    },
    {
        type: "schema",
        name: "caseDeleteReq",
        component: caseDeleteReq,
    },
    {
        type: "schema",
        name: "caseDeleteRes",
        component: caseDeleteRes,
    },
];

export type caseAddReqLike = FromSchema<typeof caseAddReq>;
export type caseAddResLike = FromSchema<typeof caseAddRes>;

export type caseGetReqLike = FromSchema<typeof caseGetReq>;
export type caseGetResLike = FromSchema<typeof caseGetRes>;

export type caseListReqLike = FromSchema<typeof caseListReq>;
export type caseListResLike = FromSchema<typeof caseListRes>;

export type caseUpdateReqLike = FromSchema<typeof caseUpdateReq>;
export type caseUpdateResLike = FromSchema<typeof caseUpdateRes>;

export type caseDeleteReqLike = FromSchema<typeof caseDeleteReq>;
export type caseDeleteResLike = FromSchema<typeof caseDeleteRes>;
