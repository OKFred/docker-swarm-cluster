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

export const myCaseIndex = {
    id: {
        type: "number",
    },
} as const satisfies Partial<Record<keyof myCaseLike, JSONSchema>>;

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
        data: { ...myCaseIndex["id"] },
        message: { type: "string" },
    },
    required: ["ok"],
    oneOf,
    additionalProperties: false,
} as const satisfies JSONSchema;

export const caseGetReq = {
    type: "object",
    properties: { ...myCaseReadable },
    required: ["id"],
    additionalProperties: false,
} as const satisfies JSONSchema;

export const caseGetRes = {
    type: "object",
    properties: {
        ok: { type: "boolean" },
        data: {
            type: "object",
            properties: myCase,
            additionalProperties: false,
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
    additionalProperties: false,
} as const satisfies JSONSchema;

export const caseUpdateRes = {
    type: "object",
    properties: {
        ok: { type: "boolean" },
        data: { ...myCaseIndex["id"] },
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
    additionalProperties: false,
} as const satisfies JSONSchema;

export const caseDeleteRes = {
    type: "object",
    properties: {
        ok: { type: "boolean" },
        data: { ...myCaseIndex["id"] },
        message: { type: "string" },
    },
    required: ["ok"],
    oneOf,
    additionalProperties: false,
} as const satisfies JSONSchema;

export type caseAddReqLike = FromSchema<typeof caseAddReq>;
export type caseAddResLike = FromSchema<typeof caseAddRes>;

export type caseGetReqLike = FromSchema<typeof caseGetReq>;
export type caseGetResLike = FromSchema<typeof caseGetRes>;

export type caseUpdateReqLike = FromSchema<typeof caseUpdateReq>;
export type caseUpdateResLike = FromSchema<typeof caseUpdateRes>;

export type caseDeleteReqLike = FromSchema<typeof caseDeleteReq>;
export type caseDeleteResLike = FromSchema<typeof caseDeleteRes>;
